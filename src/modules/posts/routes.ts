import { Application } from 'express';

import { findAll, create, find, update, destroy } from './service';

export function routes(app: Application) {
  app.get('/posts', findAll);
  app.post('/posts', create);
  app.get('/posts/:id', find);
  app.patch('/posts/:id', update);
  app.delete('/posts/:id', destroy);
}
