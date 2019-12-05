import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { Post } from './post.model';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ required: true }) author: string;
    @prop({ ref: Post, required: true}) post: Ref<Post>;
    @prop({ required: true }) text: string;
}
