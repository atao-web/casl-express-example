import { getModelForClass } from '@typegoose/typegoose';

import { Comment } from '@shared/models';

export const commentStore = getModelForClass(Comment);
