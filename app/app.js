// app.js
const express = require('express');
const app = express();

const MESSAGE = process.env.MESSAGE || 'Hello World!';
const BACKGROUND_COLOR = process.env.BACKGROUND_COLOR || '#ffffff';

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="background-color: ${BACKGROUND_COLOR}; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
        <h1>${MESSAGE}</h1>
      </body>
    </html>
  `);
});

module.exports = app;
