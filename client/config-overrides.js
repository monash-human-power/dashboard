const {
  override,
  addWebpackModuleRule,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  // Chart.js has a required dependency on moment.js. However this dependency is actually optional.
  // It is only required when using the Time Cartesion axis.
  // As we don't use this part of the module, we can nullify moment.js for a 50kB bundle reduction
  addWebpackModuleRule({
    test: path.resolve(__dirname, 'node_modules/moment'),
    loader: 'null-loader',
  }),
);
