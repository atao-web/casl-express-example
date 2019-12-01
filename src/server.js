const process = require( 'process');

const createApp = require('./app');

const API_PORT = 'API_PORT' in process.env ? (process.env['API_PORT'] || '') : '3030';

createApp()
  .then((app) => {
    app.listen(API_PORT);
    console.log(`API is listening on http://localhost:${API_PORT}`);
  });
  