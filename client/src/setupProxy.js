const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    ['/files', '/server/status'],
    proxy({
      // TODO: CHANGE ON ENVIRONMENT VARIABLE
      target: 'http://dashboard-server:5000',
    }),
  );

  app.use(
    '/socket.io',
    proxy({
      // TODO: CHANGE ON ENVIRONMENT VARIABLE
      target: 'ws://dashboard-server:5000',
      ws: true,
    }),
  );
};
