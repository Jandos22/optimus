import { SearchEffects } from './search.effects';
import { ProjectTypesEffects } from './project-types.effects';
import { ImpactTypesEffects } from './impact-types.effects';

export const effects: any[] = [
  SearchEffects,
  ProjectTypesEffects,
  ImpactTypesEffects
];

export * from './search.effects';
export * from './project-types.effects';
export * from './impact-types.effects';
