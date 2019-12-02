import { model as userModel, find, update, create } from './service';

export const model = userModel;

export function configure(app) {
  app.get('/users/:id', find);
  app.patch('/users/:id', update);
  app.post('/users', create);
}
