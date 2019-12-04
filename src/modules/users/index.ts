import { Application } from 'express';

import { userModel, find, update, create } from './service';

export const model = userModel;

export function configure(app: Application) {
  app.get('/users/:id', find);
  app.patch('/users/:id', update);
  app.post('/users', create);
}
