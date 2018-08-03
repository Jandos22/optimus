import { GroupsEffects } from './groups.effects';
import { SearchEffects } from './search.effects';
import { RightsEffects } from './rights.effects';

export const effects: any[] = [SearchEffects, GroupsEffects, RightsEffects];

export * from './search.effects';
export * from './groups.effects';
export * from './rights.effects';
