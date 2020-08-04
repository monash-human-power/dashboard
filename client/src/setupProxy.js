const proxy = require('http-proxy-middleware');

const server = process.env.DASHBOARD_SERVER_ADDRESS || 'localhost:5000';

module.exports = function(app) {
  app.use(
    ['/files', '/server/status'],
    proxy({
      target: 'http://' + server,
    })
  );

  app.use(
    '/socket.io',
    proxy({
      target: 'ws://' + server,
      ws: true,
    })
  );
};