import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromProjects from '../reducers/projects.reducer';

// select sub-feature state
export const getProjectsState = createSelector(
  fromFeature.getKaizenState,
  (state: fromFeature.KaizenState) => state.projects
);

// selectors

export const getProjectsSearching = createSelector(
  getProjectsState,
  fromProjects.getProjectsSearching
);

export const selectAllProjects = createSelector(
  getProjectsState,
  fromProjects.selectAllProjects
);

export const selectTotalDisplayedProjects = createSelector(
  getProjectsState,
  fromProjects.selectProjectsTotal
);
