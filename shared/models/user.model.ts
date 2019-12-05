import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        // working here as it's not a nested class
        toJSON: {  // Omit the password when returning a user
            transform: (doc: Document, ret: User, options: any) => {
                delete ret.password;
                return ret;
            }
        }
    }
})
export class User {
    @prop({ required: true, unique: true }) email: string;
    @prop({ required: true }) password: string;
}
