const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createTiming, advanceTiming } = require('../js/lap-timing');
const { TelemetryStore } = require('../js/telemetry-store');
const express = require('express');
const http = require('http');
const telemetryApi = require('../js/telemetry-api');

const points = [{ lat: 0, long: 0 }, { lat: 0, long: 0.001 }, { lat: 0.001, long: 0.001 }];
function sample(time, point, sessionId = 'ride') {
  return { type: 'telemetry', sessionId, timestamp: new Date(1700000000000 + time * 1000).toISOString(),
    data: { gps: { latitude: point.lat, longitude: point.long, altitude: 0, speed: 20 },
      speed: { value: 20, unit: 'km/h' }, power: { value: 100, unit: 'W' },
      cadence: { value: 90, unit: 'rpm' }, batteryVoltage: { value: 48, unit: 'V' } } };
}
async function main() {
  const state = createTiming(points);
  const readings = [sample(0, points[0]), sample(10, points[1]), sample(25, points[2]), sample(45, points[0])];
  readings.forEach(record => advanceTiming(state, record));
  assert.strictEqual(state.lapCount, 1);
  assert.strictEqual(state.segmentHistory['Full Lap'][0].durationSec, 45);
  assert.deepStrictEqual([1, 2, 3].map(i => state.segmentHistory[`Segment ${i}`][0].durationSec), [10, 15, 20]);
  advanceTiming(state, sample(46, points[0]));
  assert.strictEqual(state.lapCount, 1);
  const single = createTiming([points[0]]);
  [0, 10, 20].forEach(t => advanceTiming(single, sample(t, points[0])));
  assert.strictEqual(single.lapCount, 0, 'standing at start never produces laps');
  advanceTiming(single, sample(25, points[1]));
  advanceTiming(single, sample(30, points[0]));
  assert.strictEqual(single.segmentHistory['Full Lap'][0].durationSec, 30);
  const directory = await fs.promises.mkdtemp(path.join(os.tmpdir(), 't2-laps-'));
  try {
    const store = new TelemetryStore(directory);
    for (const record of readings) await store.append('t2/ride/telemetry', JSON.stringify(record));
    await store.saveCheckpoints('ride', points);
    const restarted = new TelemetryStore(directory);
    const snapshot = await restarted.getTelemetry('ride', { latest: true, limit: 2 });
    assert.strictEqual(snapshot.telemetry.length, 2);
    assert.strictEqual(snapshot.lapTiming.lapCount, 1, 'timing includes points outside display cap');
    assert.strictEqual(snapshot.lapTiming.checkpoints.length, 3);
    assert.strictEqual(snapshot.lapTiming.segmentHistory['Full Lap'][0].durationSec, 45);
    for (const [time, point] of [[55, points[1]], [65, points[2]], [85, points[0]]]) {
      const live = await restarted.append('t2/ride/telemetry', JSON.stringify(sample(time, point)));
      if (time === 85) assert.strictEqual(live.lapTiming.segmentHistory['Full Lap'][1].durationSec, 40);
    }
    const other = await restarted.append('t2/other/telemetry', JSON.stringify(sample(90, points[0], 'other')));
    assert.strictEqual(other.lapTiming.checkpoints.length, 0);
    assert.throws(() => store.saveCheckpoints('ride', [{ lat: 100, long: 0 }]), /valid latitude/);
    const app = express();
    app.use('/api/t2', telemetryApi(restarted));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    try {
      const result = await new Promise((resolve, reject) => {
        const req = http.request({ host: '127.0.0.1', port: server.address().port,
          path: '/api/t2/sessions/ride/checkpoints', method: 'PUT',
          headers: { 'Content-Type': 'application/json' } }, res => {
          let body = '';
          res.on('data', chunk => { body += chunk; });
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });
        req.on('error', reject);
        req.end(JSON.stringify({ checkpoints: points }));
      });
      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.body.lapCount, 2);
    } finally { await new Promise(resolve => server.close(resolve)); }
    console.log('PASS: segment sum, lap completion, stationary protection, restart/history and session isolation');
  } finally { await fs.promises.rm(directory, { recursive: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
