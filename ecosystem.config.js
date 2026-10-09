// pm2 process config for the VM (see .github/workflows/deploy_to_vm.yaml).
// PM2_NAME and PORT are set by the workflow so staging can run beside production.
module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || 'dashboard',
      script: 'server/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        MEDIAMTX_URL: 'http://localhost:8889',
      },
    },
  ],
};
