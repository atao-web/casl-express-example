import { model, Schema } from 'mongoose';

export function postFactory() {
  const Post = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  }, {
    timestamps: true
  });

  return model('Post', Post);
};
