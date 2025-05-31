module.exports = {
  apps: [
    {
      name: 'hw-devops-test-3000',
      script: 'server.js',
      env: {
        PORT: 3000,
        MESSAGE: 'Hello World A',
        BACKGROUND_COLOR: '#ffdddd' // vermelho claro
      },
    },
    {
      name: 'hw-devops-test-3001',
      script: 'server.js',
      env: {
        PORT: 3001,
        MESSAGE: 'Hello World B',
        BACKGROUND_COLOR: '#ddddff' // azul claro
      },
    },
  ],
};
