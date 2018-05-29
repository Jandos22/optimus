import { ErrorsEffects } from './errors.effects';
import { AppEffects } from './app.effects';
import { UserEffects } from './user.effects';
import { LocationsEffects } from './locations.effects';

export const effects: any[] = [
  AppEffects,
  UserEffects,
  ErrorsEffects,
  LocationsEffects
];

export * from './app.effects';
export * from './user.effects';
export * from './errors.effects';
export * from './locations.effects';
