module.exports = {
  apps: [
    {
      name: 'hw-devops-test-3000',
      script: 'server.js',
      env: {
        PORT: 3000,
      },
    },
    {
      name: 'hw-devops-test-3001',
      script: 'server.js',
      env: {
        PORT: 3001,
      },
    },
  ],
};
