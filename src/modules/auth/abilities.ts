import { AbilityBuilder, Ability } from '@casl/ability';

function defineAbilitiesFor(user/*: User*/) {
  const { rules, can } = AbilityBuilder.extract();

  can('read', ['Post', 'Comment']);
  can('create', 'UserInput');

  if (user) {
    can(['create', 'delete', 'update'], ['Post', 'Comment'], { author: user._id });
    can(['read', 'update'], 'UserInput', { _id: user._id });
  }

  return new Ability(rules);
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

export function createAbilities(req, res, next) {
  req.ability = req.user.email ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
  next();
};
