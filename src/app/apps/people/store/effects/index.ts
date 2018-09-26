import { PeoplePositionsEffects } from './people-positions.effects';
import { SearchEffects } from './search.effect';

export const effects: any[] = [SearchEffects, PeoplePositionsEffects];

export * from './search.effect';
export * from './people-positions.effects';
