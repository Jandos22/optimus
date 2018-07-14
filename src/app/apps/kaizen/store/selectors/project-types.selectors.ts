import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromProjectTypes from '../reducers/project-types.reducer';

// select sub-feature state
export const getProjectTypesState = createSelector(
  fromFeature.getKaizenState,
  (state: fromFeature.KaizenState) => state.projectTypes
);

// selectors

export const getProjectTypesSearching = createSelector(
  getProjectTypesState,
  fromProjectTypes.getProjectTypesSearching
);

export const getApplicableProjectTypes = createSelector(
  getProjectTypesState,
  fromProjectTypes.getApplicableProjectTypes
);

export const selectAllProjectTypes = createSelector(
  getProjectTypesState,
  fromProjectTypes.selectAllProjectTypes
);

export const selectProjectTypesTotal = createSelector(
  getProjectTypesState,
  fromProjectTypes.selectProjectTypesTotal
);
