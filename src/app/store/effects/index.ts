import { ErrorsEffects } from './errors.effects';
import { AppEffects } from './app.effects';
import { UserEffects } from './user.effects';

export const effects: any[] = [AppEffects, UserEffects, ErrorsEffects];

export * from './app.effects';
export * from './user.effects';
export * from './errors.effects';
