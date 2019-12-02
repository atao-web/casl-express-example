import { NotFound } from 'http-errors';
import { commentFactory } from './model';

export const model = commentFactory();

const Comment = model;

export async function findAll(req, res) {

  const comments = await Comment.accessibleBy(req.ability);

  res.send({ comments });
}

export async function create(req, res) {
  const comment = new Comment({
    ...req.body.comment,
    post: req.params.postId
  });

  if (req.user._id) {
    comment.author = req.user._id;
  }

  req.ability.throwUnlessCan('create', comment);
  await comment.save();

  res.send({ comment });
}

export async function update(req, res) {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    throw new NotFound('Comment not found');
  }

  comment.set(req.body.comment);
  req.ability.throwUnlessCan('update', comment);
  await comment.save();

  res.send({ comment });
}

export async function destroy(req, res) {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    req.ability.throwUnlessCan('delete', comment);
    await comment.remove();
  }

  res.send({ comment });
}
