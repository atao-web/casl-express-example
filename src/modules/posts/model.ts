import { getModelForClass } from '@typegoose/typegoose';

import { Post } from '@shared/models';

export const postStore = getModelForClass(Post);
