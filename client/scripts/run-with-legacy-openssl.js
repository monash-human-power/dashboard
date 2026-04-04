/**
 * react-scripts 3.x / Webpack 4 use hashing that breaks on Node 17+ (OpenSSL 3).
 * Child processes must see NODE_OPTIONS=--openssl-legacy-provider.
 */
const { spawnSync } = require('child_process');

const script = process.argv[2];
if (!['start', 'build', 'test'].includes(script)) {
  console.error('Usage: node scripts/run-with-legacy-openssl.js <start|build|test> [...args]');
  process.exit(1);
}

const rewired = require.resolve('react-app-rewired/bin/index.js');
const nodeOpts = ['--openssl-legacy-provider'];
if (process.env.NODE_OPTIONS) nodeOpts.push(process.env.NODE_OPTIONS);
const env = { ...process.env, NODE_OPTIONS: nodeOpts.join(' ') };

const result = spawnSync('node', [rewired, script, ...process.argv.slice(3)], {
  stdio: 'inherit',
  env,
});

process.exit(result.status === null ? 1 : result.status);
