const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/files', '/server/status'],
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
};
