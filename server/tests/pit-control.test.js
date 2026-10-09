const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');
const { TelemetryStore } = require('../js/telemetry-store');
const { applyPit, readPit, attachPitControl } = require('../js/pit-control');

async function main() {
  const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'mhp-pit-test-'));
  try {
    const store = new TelemetryStore(directory);
    await fs.promises.writeFile(store.filename('ride'), '');
    await fs.promises.writeFile(store.filename('other'), '');
    let sequence = 0;
    const command = (action, version, id = 'ride') => ({ sessionId: id, commandId: `test-${++sequence}`, action,
      expectedVersion: version, timestamp: new Date().toISOString() });
    const request = command('request', 0);
    let status = await applyPit(store, 'ride', request, 'crew');
    assert.strictEqual(status.state, 'preparing');
    assert.strictEqual(status.acknowledgedAt, null);
    assert.deepStrictEqual(await applyPit(store, 'ride', request, 'crew'), status);
    await assert.rejects(applyPit(store, 'ride', command('start', 0), 'crew'), /changed/);
    const conflicting = await Promise.allSettled([
      applyPit(store, 'ride', command('acknowledge', 1), 'rider'),
      applyPit(store, 'ride', command('cancel', 1), 'crew'),
    ]);
    assert.strictEqual(conflicting[0].status, 'fulfilled');
    assert.strictEqual(conflicting[1].status, 'rejected');
    status = await applyPit(store, 'ride', command('cancel', 2), 'rider');
    assert.strictEqual(status.state, 'cancelled');
    status = await applyPit(store, 'ride', command('request', 3), 'rider');
    assert.ok(status.acknowledgedAt);
    status = await applyPit(store, 'ride', command('start', 4), 'crew');
    assert.strictEqual(status.state, 'pitting');
    await assert.rejects(applyPit(store, 'ride', command('cancel', 5), 'rider'), /not allowed/);
    status = await applyPit(store, 'ride', command('complete', 5), 'rider');
    assert.strictEqual(status.state, 'completed');
    const restarted = new TelemetryStore(directory);
    const history = await restarted.run(() => readPit(restarted, 'ride'));
    assert.deepStrictEqual(history.pitStatus, status);
    assert.strictEqual(history.pitEvents.length, 6);
    assert.strictEqual((await restarted.getTelemetry('ride', { latest: true })).pitStatus.state, 'completed');
    assert.strictEqual((await restarted.run(() => readPit(restarted, 'other'))).pitStatus.state, 'idle');
    assert.throws(() => applyPit(store, 'ride', { ...command('request', 6), timestamp: '2020-01-01T00:00:00Z' }, 'crew'), /expired/);
    assert.throws(() => applyPit(store, 'ride', command('request', 6, 'other'), 'crew'), /Invalid/);
    const mqtt = new EventEmitter();
    mqtt.connected = true;
    const published = [];
    mqtt.publish = (topic, payload, options, callback) => { published.push({ topic, value: JSON.parse(payload), options }); callback(); };
    mqtt.subscribe = (topic, options, callback) => callback(null, [{ topic, qos: 1 }]);
    const io = new EventEmitter();
    let browserOne = 0;
    let browserTwo = 0;
    io.on('t2-pit-state', () => { browserOne += 1; });
    io.on('t2-pit-state', () => { browserTwo += 1; });
    attachPitControl(mqtt, io, restarted);
    await restarted.pending;
    await restarted.pitControl.execute('ride', command('request', 6), 'crew');
    assert.strictEqual(browserOne, 1);
    assert.strictEqual(browserTwo, 1);
    assert.ok(published.some((entry) => entry.topic === 't2/ride/pit/state' && entry.value.version === 7 && entry.options.retain));
    mqtt.emit('message', 't2/ride/pit/command', Buffer.from(JSON.stringify(command('cancel', 7))), { retain: true });
    await restarted.pending;
    assert.strictEqual((await readPit(restarted, 'ride')).pitStatus.version, 7);
    mqtt.emit('message', 't2/ride/pit/command', Buffer.from(JSON.stringify(command('cancel', 7))), { retain: false });
    await restarted.pending;
    assert.strictEqual((await readPit(restarted, 'ride')).pitStatus.state, 'cancelled');
    mqtt.connected = false;
    await assert.rejects(restarted.pitControl.execute('ride', command('request', 8), 'crew'), /disconnected/);
    assert.strictEqual((await readPit(restarted, 'ride')).pitStatus.version, 8);
    console.log('PASS: pit transitions, rider cancellation/ack, duplicate and stale commands, concurrent actions, restart/history, retained-state MQTT and multiple browsers');
  } finally {
    await fs.promises.rmdir(directory, { recursive: true });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
