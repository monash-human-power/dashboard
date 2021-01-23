const path = require('path');
const { override, addWebpackExternals, useEslintRc } = require('customize-cra');

module.exports = override(
  // Chart.js has a required dependency on moment.js. However this dependency is only required when
  // using the Time Cartesion axis. As we don't use this part of the module, we can drop moment.js
  // from the bundle for a 50kB bundle reduction.
  addWebpackExternals({
    moment: 'moment',
  }),

  // Use our own .eslint file rather than the config tha CRA uses
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
);
