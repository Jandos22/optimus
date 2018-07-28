import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromToolNames from '../reducers/tool-names.reducer';

// select sub-feature state
export const getToolNamesState = createSelector(
  fromFeature.getJobsRootState,
  (state: fromFeature.JobsState) => state.toolNames
);

// selectors

export const getToolNamesSearching = createSelector(
  getToolNamesState,
  fromToolNames.getToolNamesSearching
);

export const selectAllToolNames = createSelector(
  getToolNamesState,
  fromToolNames.selectAllToolNames
);

export const selectToolNamesTotal = createSelector(
  getToolNamesState,
  fromToolNames.selectToolNamesTotal
);
