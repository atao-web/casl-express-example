import { model, Model, Document, Schema } from 'mongoose';

export interface User {
  email: string;
  password: string;
}

export function userFactory (): Model<User & Document, {}> {
  const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  }, {
      timestamps: true
    });

    userSchema.method('isValidPassword', function isValidPassword (password: string) {
    return password === this.password;
  });

  return model('User', userSchema);
};
