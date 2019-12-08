import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { HookNextFunction } from 'mongoose';
import { DocumentType, getDiscriminatorModelForClass, getModelForClass, pre } from '@typegoose/typegoose';

import { User } from '@shared/models';

function hashPasswordBeforeSavingUser (password: string, isPasswordDirty: () => boolean, savePassword: (hash: string) => void, next: HookNextFunction): void {
  if (!isPasswordDirty()) {
    return;
  }
  try {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    savePassword(hash);
    return next();
  } catch (error) {
    return next(error);
  }
}

@pre<UserInput>('save', function (next: HookNextFunction) {
  hashPasswordBeforeSavingUser(this.password, 
    () => this.isModified('password'), 
    hash => { this.password = hash }, 
    next);
})
@pre<UserInput>('update', function (next: HookNextFunction) {
  hashPasswordBeforeSavingUser(this.getUpdate().$set.password, 
  () => this.getUpdate().$set.password, 
  hash => { this.getUpdate().$set.password = hash }, 
  next);
})
export class UserInput extends User {
  comparePassword (candidatePassword: string): boolean {
    return compareSync(candidatePassword, this.password);
  }
}

export const userStore = getModelForClass(User);

export const userInputStore = getDiscriminatorModelForClass(userStore, UserInput);
