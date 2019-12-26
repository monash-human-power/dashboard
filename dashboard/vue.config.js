module.exports = {
  devServer: {
    proxy: {
      '^/(files|server/status)': {
        target: 'http://localhost:5000',
      },
    },
  },
};
