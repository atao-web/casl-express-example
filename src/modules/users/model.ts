import { model, Model, Document, Schema } from 'mongoose';

export function userFactory (): Model<Document, {}> {
  const User = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  }, {
      timestamps: true
    });

  User.method('isValidPassword', function isValidPassword (password: string) {
    return password === this.password;
  });

  return model('User', User);
};
