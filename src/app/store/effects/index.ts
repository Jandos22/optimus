import { ApplicationEffects } from './application.effects';
import { UserEffects } from './user.effects';

export const effects: any[] = [ApplicationEffects, UserEffects];

export * from './application.effects';
export * from './user.effects';
