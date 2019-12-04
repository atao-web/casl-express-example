import { Document, model, Model, Schema } from 'mongoose';

export interface Post {
  author: string;
  title: string;
  text: string;
}

export function postFactory (): Model<Post & Document, {}> {
  const postSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true }
  }, {
      timestamps: true
    });

  return model('Post', postSchema);
};
