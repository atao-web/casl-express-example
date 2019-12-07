import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { HookNextFunction } from 'mongoose';
import { DocumentType, getDiscriminatorModelForClass, getModelForClass, pre } from '@typegoose/typegoose';

import { User } from '@shared/models';

function hashPasswordBeforeSavingUser (user: DocumentType<UserInput>, next: HookNextFunction): void {
  try {
    const salt = genSaltSync(10);
    const hash = hashSync(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
}

@pre<UserInput>('save', function (next: HookNextFunction) {
  hashPasswordBeforeSavingUser(this, next);
})
export class UserInput extends User {
  comparePassword (candidatePassword: string): boolean {
    return compareSync(candidatePassword, this.password);
  }
}

export const userStore = getModelForClass(User);

export const userInputStore = getDiscriminatorModelForClass(userStore, UserInput);
