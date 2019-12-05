import { getModelForClass, getDiscriminatorModelForClass } from '@typegoose/typegoose';

import { User } from '@shared/models';

export class UserInput extends User {
  // This method should stay on server side as eventually passwords will be encrypted
  isValidPassword (candidatePassword: string): boolean {
    return candidatePassword === this.password;
  }
}

export const userStore = getModelForClass(User);

export const userInputStore = getDiscriminatorModelForClass(userStore, UserInput);
