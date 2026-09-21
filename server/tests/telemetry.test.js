const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const EventEmitter = require('events');
const express = require('express');
const { TelemetryStore } = require('../js/telemetry-store');
const telemetryApi = require('../js/telemetry-api');
const attachT2Telemetry = require('../js/t2-telemetry');

function sample(sessionId, speed = 0) {
  return {
    type: 'telemetry',
    sessionId,
    timestamp: '2026-09-21T01:00:00.000Z',
    data: {
      speed: { value: speed, unit: 'km/h' },
      power: { value: 0, unit: 'W' },
      cadence: { value: 0, unit: 'rpm' },
      batteryVoltage: { value: 48.2, unit: 'V' },
      gps: { latitude: -37.9, longitude: 145.1, altitude: 35, speed: 0 },
    },
  };
}

function get(server, endpoint) {
  return new Promise((resolve, reject) => {
    http
      .get(
        { host: '127.0.0.1', port: server.address().port, path: endpoint },
        (res) => {
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, body: JSON.parse(body) });
            } catch (error) {
              reject(error);
            }
          });
        },
      )
      .on('error', reject);
  });
}

async function main() {
  const directory = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'mhp-telemetry-test-'),
  );
  let server;
  try {
    const store = new TelemetryStore(directory);
    assert.deepStrictEqual((await store.listSessions()).sessions, []);
    const topic = 't2/test-session/telemetry';
    const first = sample('test-session');
    await Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        store.append(topic, JSON.stringify(sample('test-session', i))),
      ),
    );
    await store.append('t2/Other/telemetry', JSON.stringify(sample('Other')));
    await store.append('t2/other/telemetry', JSON.stringify(sample('other')));
    assert.strictEqual((await store.listSessions()).total, 3); // Windows filenames remain distinct.
    const page = await store.getTelemetry('test-session', {
      offset: 5,
      limit: 3,
    });
    assert.strictEqual(page.total, 12);
    assert.deepStrictEqual(
      page.telemetry.map((record) => record.data.speed.value),
      [5, 6, 7],
    );
    assert.strictEqual(page.nextOffset, 8);
    assert.strictEqual(page.telemetry[0].timestamp, first.timestamp);
    assert.ok(Number.isFinite(Date.parse(page.telemetry[0].receivedAt)));
    // A fresh store instance reads previous sessions without any in-memory index.
    const restarted = new TelemetryStore(directory);
    assert.match(path.basename(store.filename('test-session')), /^session-test-session_[a-f0-9]{12}\.jsonl$/);
    // Simulate an existing hash-only archive and verify migration preserves bytes.
    const originalBytes = await fs.promises.readFile(store.filename('test-session'));
    await fs.promises.rename(store.filename('test-session'), store.filename('test-session', true));
    assert.strictEqual(
      (await restarted.getTelemetry('test-session')).total,
      12,
    );
    assert.deepStrictEqual(await fs.promises.readFile(store.filename('test-session')), originalBytes);
    await restarted.append(topic, JSON.stringify(sample('test-session', 12)));
    assert.strictEqual((await restarted.getTelemetry('test-session')).total, 13);
    // Restore the fixture count for the remaining pagination assertions.
    await fs.promises.writeFile(store.filename('test-session'), originalBytes);
    assert.throws(() => store.append(topic, '{broken'), /JSON/);
    assert.throws(
      () => store.append(topic, JSON.stringify(sample('wrong'))),
      /must match/,
    );
    assert.throws(
      () =>
        store.append(
          topic,
          JSON.stringify({ ...first, timestamp: 'not a date' }),
        ),
      /timestamp/,
    );
    assert.throws(() => store.getTelemetry('../escape'), /sessionId/);
    assert.throws(
      () => store.append(topic, JSON.stringify({ ...first, data: {} })),
      /speed/,
    );
    await assert.rejects(
      store.getTelemetry('unknown'),
      (error) => error.status === 404,
    );
    // Disk failures reject without poisoning the queue or pretending to save data.
    const blockedPath = path.join(directory, 'not-a-directory');
    await fs.promises.writeFile(blockedPath, 'test');
    await assert.rejects(
      new TelemetryStore(blockedPath).append(topic, JSON.stringify(first)),
    );

    const mqtt = new EventEmitter();
    let subscriptions = 0;
    mqtt.subscribe = (name, options, callback) => {
      assert.strictEqual(name, 't2/+/telemetry');
      subscriptions += 1;
      callback(null, [{ topic: name, qos: options.qos }]);
    };
    const io = new EventEmitter();
    attachT2Telemetry(mqtt, io, store);
    mqtt.emit('connect');
    mqtt.emit(
      'message',
      't2/headless/telemetry',
      Buffer.from(JSON.stringify(sample('headless'))),
    );
    assert.strictEqual((await store.getTelemetry('headless')).total, 1);
    let browserOne = 0;
    let browserTwo = 0;
    io.on('t2-telemetry', () => {
      browserOne += 1;
    });
    io.on('t2-telemetry', () => {
      browserTwo += 1;
    });
    mqtt.emit('connect'); // Broker reconnect resubscribes without another message handler.
    mqtt.emit(
      'message',
      't2/headless/telemetry',
      Buffer.from(JSON.stringify(sample('headless', 10))),
    );
    assert.strictEqual((await store.getTelemetry('headless')).total, 2);
    assert.strictEqual(browserOne, 1);
    assert.strictEqual(browserTwo, 1);
    assert.strictEqual(subscriptions, 2);

    const app = express();
    app.use('/api/t2', telemetryApi(restarted));
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const downloaded = await new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port: server.address().port,
        path: '/api/t2/sessions/test-session/file' }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    });
    assert.strictEqual(downloaded.status, 200);
    assert.ok(downloaded.headers['content-disposition'].includes('session-test-session_'));
    assert.strictEqual(downloaded.body, originalBytes.toString());
    assert.strictEqual((await get(server, '/api/t2/sessions/unknown/file')).status, 404);
    assert.strictEqual((await get(server, '/api/t2/sessions/a%2Fb/file')).status, 400);
    const listed = await get(server, '/api/t2/sessions?limit=2');
    assert.strictEqual(listed.status, 200);
    assert.strictEqual(listed.body.total, 4);
    assert.strictEqual(listed.body.sessions.length, 2);
    const retrieved = await get(
      server,
      '/api/t2/sessions/test-session/telemetry?offset=11&limit=2',
    );
    assert.strictEqual(retrieved.status, 200);
    assert.strictEqual(retrieved.body.telemetry.length, 1);
    assert.strictEqual(retrieved.body.nextOffset, null);
    assert.strictEqual(
      (await get(server, '/api/t2/sessions/unknown/telemetry')).status,
      404,
    );
    assert.strictEqual(
      (await get(server, '/api/t2/sessions?limit=1001')).status,
      400,
    );
    assert.strictEqual(
      (await get(server, '/api/t2/sessions?offset=-1')).status,
      400,
    );
    assert.strictEqual(
      (await get(server, '/api/t2/sessions?limit=1&limit=2')).status,
      400,
    );
    assert.strictEqual(
      (await get(server, '/api/t2/sessions/a%2Fb/telemetry')).status,
      400,
    );
    assert.strictEqual((await get(server, '/api/t2/missing')).status, 404);
    console.log(
      'PASS: persistent telemetry, pagination, validation, REST errors, reconnect and browser-independent recording',
    );
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    // Only the isolated directory created by this test is removed.
    await fs.promises.rm(directory, { recursive: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
