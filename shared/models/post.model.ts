import { modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Post {
    @prop({ ref: User, required: true }) author: Ref<User>;
    @prop({ required: true }) title: string;
    @prop({ required: true }) text: string;
}
