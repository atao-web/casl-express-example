import { NotFound } from 'http-errors';

import { userFactory } from './model';

const userModel = userFactory();

export const model = userModel;

export async function find(req, res) {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    throw new NotFound('User not found, id: ' + req.params.id);
  }

  req.ability.throwUnlessCan('read', user);
  res.send({ user });
}

export async function update(req, res) {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    throw new NotFound('User to update not found, id: ' + req.params.id);
  }

  user.set(req.body.user);
  req.ability.throwUnlessCan('update', user);
  await user.save();

  res.send({ user });
}

export async function create(req, res) {
  const user = new userModel(req.body.user);

  req.ability.throwUnlessCan('create', user);
  await user.save();

  res.status(201).send({ user });
}
