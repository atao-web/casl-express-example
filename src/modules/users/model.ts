import { compareSync, genSalt, hash as bcHash } from 'bcryptjs';
import { HookNextFunction } from 'mongoose';
import { DocumentType, getDiscriminatorModelForClass, getModelForClass, pre } from '@typegoose/typegoose';

import { User } from '@shared/models';

function hashPasswordBeforeSavingUser (user: DocumentType<UserInput>/*|DocumentQuery<UserInput>*/, next: HookNextFunction): void {
  if (!user.isModified('password')) {
    return;
  }
  genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcHash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      return next();
    });
  });
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
