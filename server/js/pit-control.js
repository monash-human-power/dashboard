const fs = require('fs');
const path = require('path');

function failure(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function initialPit(sessionId) {
  return { sessionId, state: 'idle', version: 0, requestedBy: null, acknowledgedAt: null };
}

async function readPit(store, sessionId) {
  // filename() validates the session ID before any filesystem access.
  const filename = `${store.filename(sessionId)}.pit.jsonl`;
  const events = [];
  try {
    await store.constructor.scan(filename, (event) => events.push(event));
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  return { pitStatus: events.length ? events[events.length - 1] : initialPit(sessionId), pitEvents: events };
}

function applyPit(store, sessionId, command, source) {
  store.filename(sessionId);
  if (!['crew', 'rider'].includes(source)) throw failure('Invalid pit source');
  if (!command || command.sessionId !== sessionId || !/^[A-Za-z0-9._-]{1,128}$/.test(command.commandId || '')
    || !Number.isSafeInteger(command.expectedVersion) || command.expectedVersion < 0
    || !['request', 'cancel', 'acknowledge', 'start', 'complete'].includes(command.action)) {
    throw failure('Invalid pit command');
  }
  const timestamp = Date.parse(command.timestamp);
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > 60000 || timestamp - Date.now() > 15000)
    throw failure('Pit command expired or has an invalid timestamp');
  return store.run(async () => {
    try { await fs.promises.access(await store.resolveFilename(sessionId)); }
    catch (error) { if (error.code === 'ENOENT') throw failure('Session not found', 404); throw error; }
    const history = await readPit(store, sessionId);
    const previous = history.pitStatus;
    const duplicate = history.pitEvents.find((event) => event.commandId === command.commandId);
    if (duplicate) {
      if (duplicate.action !== command.action || duplicate.source !== source) throw failure('Command ID already used', 409);
      return previous;
    }
    if (command.expectedVersion !== previous.version) throw failure('Pit status changed. Refresh and try again.', 409);
    const transitions = {
      request: ['idle', 'completed', 'cancelled'], cancel: ['preparing'],
      acknowledge: ['preparing'], start: ['preparing'], complete: ['pitting'],
    };
    if (!transitions[command.action].includes(previous.state)) throw failure('Action not allowed for the current pit status', 409);
    if (command.action === 'acknowledge' && source !== 'rider') throw failure('Only the rider can acknowledge a request');
    const event = { ...previous, commandId: command.commandId, action: command.action, source,
      timestamp: new Date().toISOString(), version: previous.version + 1 };
    if (command.action === 'request') {
      event.state = 'preparing'; event.requestedBy = source;
      event.acknowledgedAt = source === 'rider' ? event.timestamp : null;
    } else if (command.action === 'acknowledge') event.acknowledgedAt = event.timestamp;
    else event.state = { cancel: 'cancelled', start: 'pitting', complete: 'completed' }[command.action];
    await fs.promises.appendFile(`${store.filename(sessionId)}.pit.jsonl`, `${JSON.stringify(event)}\n`, 'utf8');
    return event;
  });
}

function attachPitControl(mqtt, io, store) {
  const publishedVersions = new Map();
  const publishState = (state) => new Promise((resolve, reject) => {
    if (!mqtt.connected) { reject(failure('MQTT broker disconnected', 503)); return; }
    if (state.version < (publishedVersions.get(state.sessionId) || 0)) { resolve(); return; }
    publishedVersions.set(state.sessionId, state.version);
    const timer = setTimeout(() => reject(failure('Broker acknowledgement timed out', 503)), 8000);
    mqtt.publish(`t2/${state.sessionId}/pit/state`, JSON.stringify(state), { qos: 1, retain: true }, (error) => {
      clearTimeout(timer); if (error) reject(error); else resolve();
    });
  });
  const execute = async (id, command, source) => {
    if (!mqtt.connected) throw failure('MQTT broker disconnected. Pit command was not applied.', 503);
    const state = await applyPit(store, id, command, source);
    io.emit('t2-pit-state', state);
    let deliveryError = null;
    try { await publishState(state); } catch (error) { deliveryError = error.message; }
    return { ...state, deliveryError, mqttConnected: !!mqtt.connected };
  };
  store.pitControl = { execute, connected: () => !!mqtt.connected };
  const connection = () => io.emit('t2-pit-connection', { connected: !!mqtt.connected });
  const subscribe = () => {
    connection();
    mqtt.subscribe('t2/+/pit/command', { qos: 1 }, (error, granted) => {
      if (error || !granted || granted.some((entry) => entry.qos === 128)) console.error('Unable to subscribe to pit commands');
    });
    // Restore the latest persisted state after reconnect, never replay commands.
    store.run(async () => {
      const names = (await fs.promises.readdir(store.directory)).filter((name) => name.endsWith('.pit.jsonl'));
      const states = [];
      for (const name of names) {
        let state;
        await store.constructor.scan(path.join(store.directory, name), (event) => { state = event; });
        if (state) states.push(state);
      }
      return states;
    }).then(async (states) => {
      for (const state of states) await publishState(state);
    }).catch((error) => console.error('Pit state restore failed:', error.message));
  };
  mqtt.on('connect', subscribe);
  mqtt.on('close', connection);
  mqtt.on('offline', connection);
  mqtt.on('message', (topic, payload, packet) => {
    const match = /^t2\/([^/]+)\/pit\/command$/.exec(topic);
    if (!match || (packet && packet.retain)) return;
    if (payload.length > 8192) return;
    try {
      const command = JSON.parse(payload.toString());
      execute(match[1], command, 'rider').catch((error) => console.error('Rejected rider pit command:', error.message));
    } catch (error) { console.error('Rejected rider pit command:', error.message); }
  });
  if (mqtt.connected) subscribe();
}

module.exports = { initialPit, readPit, applyPit, attachPitControl };
