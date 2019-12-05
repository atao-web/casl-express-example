import { NotFound } from 'http-errors';

import { userInputStore as model } from './model';

export async function find(req, res) {
  const user = await model.findById(req.params.id);

  if (!user) {
    throw new NotFound('User not found, id: ' + req.params.id);
  }

  req.ability.throwUnlessCan('read', user);
  res.send({ user });
}

export async function update(req, res) {
  const user = await model.findById(req.params.id);

  if (!user) {
    throw new NotFound('User to update not found, id: ' + req.params.id);
  }

  user.set(req.body.user);
  req.ability.throwUnlessCan('update', user);
  await user.save();

  res.send({ user });
}

export async function create(req, res) {
  const user = new model(req.body.user);

  req.ability.throwUnlessCan('create', user);
  await user.save();

  res.status(201).send({ user });
}
