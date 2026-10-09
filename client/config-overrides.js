const crypto = require('crypto');
const path = require('path');
const { override, addWebpackExternals, useEslintRc } = require('customize-cra');

// Webpack 4 hashes with md4, which OpenSSL 3 (Node 17+) no longer provides.
// Substitute sha256 so the client builds on current Node versions.
try {
  crypto.createHash('md4');
} catch (e) {
  const { createHash } = crypto;
  crypto.createHash = (algorithm, ...args) =>
    createHash(algorithm === 'md4' ? 'sha256' : algorithm, ...args);
}

module.exports = override(
  // Chart.js has a required dependency on moment.js. However this dependency is only required when
  // using the Time Cartesion axis. As we don't use this part of the module, we can drop moment.js
  // from the bundle for a 50kB bundle reduction.
  addWebpackExternals({
    moment: 'moment',
  }),

  // Use our own .eslint file rather than the config tha CRA uses
  //useEslintRc(path.resolve(__dirname, '.eslintrc')),
  (config) => {
    config.module.rules = config.module.rules.filter(
      (rule) =>
        !(
          rule.use &&
          rule.use.some((u) => u.loader && u.loader.includes('eslint-loader'))
        ),
    );
    return config;
  },
);