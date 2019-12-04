import { Document, model, Model, Schema } from 'mongoose';

export interface Comment {
  author: string;
  post: Schema.Types.ObjectId;
  test: string;
}

export function commentFactory (): Model<Comment & Document, {}> {
  const commentSchema = new Schema({
    author: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true }
  }, {
      timestamps: true
    });

  return model('Comment', commentSchema);
};
