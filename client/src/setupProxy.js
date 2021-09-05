const proxy = require('http-proxy-middleware');

const serverRoute = process.env.DOCKER_SERVER ?? 'localhost:5000';

module.exports = function (app) {
  app.use(
    ['/files', '/server/status'],
    proxy({
      target: `http://${serverRoute}`,
    }),
  );

  app.use(
    '/socket.io',
    proxy({
      target: `ws://${serverRoute}`,
      ws: true,
    }),
  );
};
