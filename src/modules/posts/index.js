import { model as postModel, findAll, create, find, update, destroy } from './service';

export const model = postModel;

export function configure(app) {
  app.get('/posts', findAll);
  app.post('/posts', create);
  app.get('/posts/:id', find);
  app.patch('/posts/:id', update);
  app.delete('/posts/:id', destroy);
}
