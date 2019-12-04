import { NotFound } from 'http-errors';
import { postFactory } from './model';

const postModel = postFactory();

export const model = postModel;

export async function findAll(req, res) {
  const posts = await postModel.accessibleBy(req.ability);
  res.send({ posts });
}

export async function find(req, res) {
  const post = await postModel.findById(req.params.id);

  if (!post) {
    throw new NotFound('Post not found, id: ' + req.params.id);
  }

  req.ability.throwUnlessCan('update', post);
  res.send({ post });
}

export async function create(req, res) {
  const post = new postModel({
    ...req.body.post,
    author: req.user._id
  });

  req.ability.throwUnlessCan('create', post);
  await post.save();
  res.send({ post });
}

export async function update(req, res) {
  const post = await postModel.findById(req.params.id);

  if (!post) {
    throw new NotFound('Post to update not found, id: ' + req.params.id);
  }

  post.set(req.body.post);
  req.ability.throwUnlessCan('update', post);
  await post.save();

  res.send({ post });
}

export async function destroy(req, res) {
  const post = await postModel.findById(req.params.id);

  if (post) {
    req.ability.throwUnlessCan('delete', post);
    await post.remove();
  }

  res.send({ post });
}
