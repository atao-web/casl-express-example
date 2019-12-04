import { Application } from 'express';

import { findAll, create, update, destroy } from './service';

export function routes(app: Application) {
  app.get('/posts/:postId/comments', findAll);
  app.post('/posts/:postId/comments', create);

  app.patch('/posts/:postId/comments/:id', update);
  app.delete('/posts/:postId/comments/:id', destroy);
}
