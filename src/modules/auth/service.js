import { model } from 'mongoose';
import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from 'jsonwebtoken';

import { JwtParams } from './jwt';

export async function create(req, res) {
  const { email, password } = req.body.session || {};

  if (!email || !password) {
    throw new BadRequest('Please specify "email" and "password" fields is "session" object');
  }

  const user = await model('User').findOne({ email });

  if (!user || !user.isValidPassword(password)) {
    throw new Unauthorized('Not authenticated');
  }

  const accessToken = sign({ id: user.id }, req.app.get(JwtParams.secret), {
    issuer: req.app.get(JwtParams.issuer),
    audience: req.app.get(JwtParams.audience)
  });

  res.send({ accessToken });
}
