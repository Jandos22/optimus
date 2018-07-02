import { ErrorsEffects } from './errors.effects';
import { AppsEffects } from './apps.effects';
import { LocationsEffects } from './locations.effects';

export const effects: any[] = [AppsEffects, ErrorsEffects, LocationsEffects];

export * from './apps.effects';
export * from './errors.effects';
export * from './locations.effects';
