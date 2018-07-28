import { PeoplePositionsEffects } from './people-positions.effects';
import { UsersSearchEffects } from './search.effect';

export const effects: any[] = [UsersSearchEffects, PeoplePositionsEffects];

export * from './search.effect';
export * from './people-positions.effects';
