const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/files', '/server/status'],
    proxy({
      target: 'http://dashboard-server:5000',
    }),
  );

  app.use(
    '/socket.io',
    proxy({
      target: 'ws://dashboard-server:5000',
      ws: true,
    }),
  );
};
