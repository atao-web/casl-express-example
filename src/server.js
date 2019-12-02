import { env } from 'process';

import { createApp } from './app';

const API_PORT = 'API_PORT' in env ? (env['API_PORT'] || '') : '3030';

createApp()
  .then((app) => {
    app.listen(API_PORT);
    console.log(`API is listening on http://localhost:${API_PORT}`);
  });
  