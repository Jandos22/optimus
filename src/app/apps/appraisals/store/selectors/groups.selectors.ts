import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromGroups from '../reducers/groups.reducer';

// select sub-feature state
export const getGroupsState = createSelector(
  fromFeature.getAppraisalsRootState,
  (state: fromFeature.AppraisalsState) => state.groups
);

// selectors

export const getAppraisalGroups = createSelector(
  getGroupsState,
  fromGroups.getAppraisalGroups
);
