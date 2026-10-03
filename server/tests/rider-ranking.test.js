const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const express = require('express');
const { TelemetryStore } = require('../js/telemetry-store');
const telemetryApi = require('../js/telemetry-api');

function sample(id, speed = 45, power = 250) {
  return JSON.stringify({
    type: 'telemetry',
    sessionId: id,
    timestamp: '2026-09-29T00:00:00Z',
    data: {
      speed: { value: speed, unit: 'km/h' },
      power: { value: power, unit: 'W' },
      cadence: { value: 90, unit: 'rpm' },
      batteryVoltage: { value: 48, unit: 'V' },
      gps: { latitude: -38, longitude: 145, altitude: 0, speed },
    },
  });
}
async function main() {
  const directory = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'mhp-riders-'),
  );
  let server;
  try {
    const store = new TelemetryStore(directory);
    const append = (speed, power) =>
      store.append('t2/ride/telemetry', sample('ride', speed, power));
    await append(); // Unassigned, never retroactively attributed.
    let changes = 0;
    store.riderEvents.on('change', () => {
      changes += 1;
    });
    const a = await store.selectRider('ride', { name: ' Alice ' });
    const alice = a.activeRiderId;
    await append(45, 200);
    assert.strictEqual((await store.getRiders('ride')).riders[0].scores, null);
    const b = await store.selectRider('ride', { name: 'Bob' });
    await append(0, 0);
    await append(0, 0);
    const back = await store.selectRider('ride', { name: 'ALICE' });
    assert.strictEqual(back.activeRiderId, alice);
    assert.strictEqual(back.riders.length, 2);
    await append(45, 300);
    let rankings = await store.getRiders('ride');
    assert.strictEqual(rankings.riders[0].samples, 2);
    assert.strictEqual(rankings.riders[0].cv, 20);
    assert.strictEqual(rankings.riders[0].scores.total, 84.75);
    assert.strictEqual(rankings.riders[1].scores.total, 0);
    assert.strictEqual(changes, 3);
    const restarted = new TelemetryStore(directory);
    assert.deepStrictEqual(await restarted.getRiders('ride'), rankings);
    const restored = await restarted.append(
      't2/ride/telemetry',
      sample('ride'),
    );
    assert.strictEqual(restored.riderId, alice);
    assert.strictEqual(restored.riderRankings.riders[0].samples, 3);
    await restarted.selectRider('ride', { riderId: null });
    await restarted.append('t2/ride/telemetry', sample('ride'));
    assert.strictEqual(
      (await restarted.getRiders('ride')).riders[0].samples,
      3,
    );
    await restarted.append('t2/other/telemetry', sample('other'));
    assert.deepStrictEqual((await restarted.getRiders('other')).riders, []);
    assert.throws(() => restarted.selectRider('ride', { name: ' ' }), /name/);
    await assert.rejects(
      restarted.selectRider('ride', { riderId: 'unknown' }),
      /not found/,
    );
    const snapshot = await restarted.getTelemetry('ride', {
      latest: true,
      limit: 2,
    });
    assert.strictEqual(snapshot.telemetry.length, 2);
    assert.strictEqual(snapshot.riderRankings.riders[0].samples, 3);
    // Confirm full history, not just the visible tail, is counted after restart.
    const bulk = Array.from({ length: 20002 }, () =>
      JSON.stringify({ ...JSON.parse(sample('large')), riderId: alice }),
    ).join('\n');
    await fs.promises.writeFile(restarted.filename('large'), `${bulk}\n`);
    await fs.promises.writeFile(
      `${restarted.filename('large')}.riders.json`,
      JSON.stringify({
        revision: 1,
        activeRiderId: alice,
        riders: [{ id: alice, name: 'Alice' }],
      }),
    );
    const large = await restarted.getTelemetry('large', {
      latest: true,
      limit: 20000,
    });
    assert.strictEqual(large.telemetry.length, 20000);
    assert.strictEqual(large.riderRankings.riders[0].samples, 20002);
    assert.strictEqual(large.riderRankings.riders[0].scores.total, 99.75);
    const app = express();
    app.use('/api/t2', telemetryApi(restarted));
    server = await new Promise((resolve) => {
      const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
    });
    const result = await new Promise((resolve, reject) => {
      const request = http.request(
        {
          host: '127.0.0.1',
          port: server.address().port,
          path: '/api/t2/sessions/ride/riders',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        },
        (response) => {
          let body = '';
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () =>
            resolve({ status: response.statusCode, body: JSON.parse(body) }),
          );
        },
      );
      request.on('error', reject);
      request.end(JSON.stringify({ riderId: b.activeRiderId }));
    });
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.body.activeRiderId, b.activeRiderId);
    console.log(
      'PASS: rider formulas, switching, unassigned readings, restart, REST, session isolation and full-session totals beyond 20K',
    );
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    await fs.promises.rmdir(directory, { recursive: true });
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
