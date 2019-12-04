import { Application } from 'express';

import { find, update, create } from './service';

export function routes(app: Application) {
  app.get('/users/:id', find);
  app.patch('/users/:id', update);
  app.post('/users', create);
}
