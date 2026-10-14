const crypto = require('crypto');
const express = require('express');
const { validateTelemetry } = require('./telemetry-store');

function tokensMatch(supplied, expected) {
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

function telemetryIngestRouter(store, io) {
  const router = express.Router();
  router.post('/telemetry', express.json({ limit: '1mb' }), async (req, res) => {
    const expected = process.env.TELEMETRY_INGEST_TOKEN;
    const supplied = (req.get('authorization') || '').replace(/^Bearer /, '');
    if (!expected || !tokensMatch(supplied, expected)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const record = await store.append(
        `t2/${req.body?.sessionId}/telemetry`,
        Buffer.from(JSON.stringify(req.body)),
      );
      io.emit('t2-telemetry', record);
      res.status(201).json({ eventId: record.eventId });
    } catch (error) {
      if (error.status === 400) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Failed to save T2 telemetry:', error.message);
      res.status(500).json({ error: 'Unable to save telemetry' });
    }
  });
  return router;
}

function attachT2Telemetry(mqttClient, io, store) {
  store.riderEvents.on('change', (ranking) => io.emit('t2-riders', ranking));
  const subscribe = () =>
    mqttClient.subscribe('t2/+/telemetry', { qos: 1 }, (error, granted) => {
      if (error || !granted || granted.some((entry) => entry.qos === 128)) {
        console.error(
          'Unable to subscribe to T2 telemetry:',
          error ? error.message : 'subscription rejected',
        );
      } else {
        console.log('Subscribed to T2 telemetry');
      }
    });
  mqttClient.on('connect', subscribe);
  mqttClient.on('message', (topic, payload) => {
    if (!/^t2\/[^/]+\/telemetry$/.test(topic)) return;
    let value;
    try {
      value = validateTelemetry(topic, payload);
    } catch (error) {
      console.error('Rejected T2 telemetry:', error.message);
      return;
    }
    // Broadcast saved event IDs so history/live overlap can be deduplicated.
    console.log('T2 telemetry received:', value);
    store.append(topic, payload).then((record) => {
      io.emit('t2-telemetry', record);
    }).catch((error) => {
      io.emit('t2-telemetry', value);
      console.error('Failed to save T2 telemetry:', error.message);
    });
  });
  if (mqttClient.connected) subscribe();
}

module.exports = { attachT2Telemetry, telemetryIngestRouter };
