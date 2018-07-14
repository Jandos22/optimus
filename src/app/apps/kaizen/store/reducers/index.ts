import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromProjects from './projects.reducer';
import * as fromProjectTypes from './project-types.reducer';
import * as fromImpactTypes from './impact-types.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface KaizenState {
  projects: fromProjects.ProjectsState;
  projectTypes: fromProjectTypes.ProjectTypesState;
  impactTypes: fromImpactTypes.ImpactTypesState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<KaizenState> = {
  projects: fromProjects.reducer,
  projectTypes: fromProjectTypes.reducer,
  impactTypes: fromImpactTypes.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getKaizenState = createFeatureSelector<KaizenState>('kaizen');
