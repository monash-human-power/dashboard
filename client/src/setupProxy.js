const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/files', '/server/status', '/api'],
    proxy({
      target: 'http://localhost:5000',
    }),
  );

  app.use(
    '/socket.io',
    proxy({
      target: 'ws://localhost:5000',
      ws: true,
    }),
  );

  // MediaMTX WHEP (WebRTC) video playback endpoint
  app.use(
    '/whep',
    proxy({
      target: 'http://localhost:8889',
      pathRewrite: { '^/whep': '' },
    }),
  );
};
