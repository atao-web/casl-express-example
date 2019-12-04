import { AbilityBuilder, Ability } from '@casl/ability';

// import { User } from 'modules/users/model';

function defineAbilitiesFor(user/*: User*/) {
  const { rules, can } = AbilityBuilder.extract();

  can('read', ['Post', 'Comment']);
  can('create', 'User');

  if (user) {
    can(['create', 'delete', 'update'], ['Post', 'Comment'], { author: user._id });
    can(['read', 'update'], 'User', { _id: user.id });
  }

  return new Ability(rules);
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

export function createAbilities(req, res, next) {
  console.log("createAbilities with req.user: ", req.user)
  req.ability = req.user.email ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
  next();
};
