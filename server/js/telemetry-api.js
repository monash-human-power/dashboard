const express = require('express');

function pagination(query) {
  const result = {};
  ['offset', 'limit'].forEach((key) => {
    const fallback = key === 'offset' ? 0 : 100;
    const raw = query[key] === undefined ? String(fallback) : query[key];
    const number = Number(raw);
    if (
      typeof raw !== 'string' ||
      !/^\d+$/.test(raw) ||
      !Number.isSafeInteger(number) ||
      number < (key === 'offset' ? 0 : 1) ||
      (key === 'limit' && number > 1000)
    ) {
      const error = new Error(
        'offset must be a non-negative integer; limit must be between 1 and 1000',
      );
      error.status = 400;
      throw error;
    }
    result[key] = number;
  });
  return result;
}

function telemetryApi(store) {
  const router = express.Router();
  router.put('/sessions/:sessionId/checkpoints', express.json({ limit: '256kb' }), async (req, res, next) => {
    try {
      res.json(await store.saveCheckpoints(req.params.sessionId, req.body.checkpoints));
    } catch (error) { next(error); }
  });
  router.get('/sessions/:sessionId/snapshot', async (req, res, next) => {
    try {
      res.set('Cache-Control', 'no-store');
      res.json(await store.getTelemetry(req.params.sessionId, { limit: 20000, latest: true }));
    } catch (error) {
      next(error);
    }
  });
  router.get('/sessions/:sessionId/file', async (req, res, next) => {
    try {
      const filename = await store.run(() => store.resolveFilename(req.params.sessionId));
      res.download(filename, (error) => {
        if (error && !res.headersSent) next(error);
      });
    } catch (error) {
      next(error);
    }
  });
  router.get('/sessions', async (req, res, next) => {
    try {
      res.json(await store.listSessions(pagination(req.query)));
    } catch (error) {
      next(error);
    }
  });
  router.get('/sessions/:sessionId/telemetry', async (req, res, next) => {
    try {
      res.json(
        await store.getTelemetry(req.params.sessionId, pagination(req.query)),
      );
    } catch (error) {
      next(error);
    }
  });
  router.use((req, res) =>
    res.status(404).json({ error: 'API endpoint not found' }),
  );
  // Express identifies error middleware by its four arguments.
  // eslint-disable-next-line no-unused-vars
  router.use((error, req, res, next) => {
    const status = error.status || 500;
    if (status === 500)
      console.error('Telemetry storage error:', error.message);
    res.status(status).json({
      error:
        status === 500 ? 'Unable to read telemetry storage' : error.message,
    });
  });
  return router;
}

module.exports = telemetryApi;
