module.exports = {
  devServer: {
    proxy: {
      '^/(files|server/status)': {
        target: 'http://localhost:5000',
      },
      '^/socket.io': {
        target: 'ws://localhost:5000',
        ws: true,
      },
    },
  },
};
