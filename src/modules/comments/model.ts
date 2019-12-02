import { Document, model, Model, Schema } from 'mongoose';

export function commentFactory (): Model<Document, {}> {
  const Comment = new Schema({
    author: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true }
  }, {
      timestamps: true
    });

  return model('Comment', Comment);
};
