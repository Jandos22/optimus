import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromRights from '../reducers/rights.reducer';

// select sub-feature state
export const getRightsState = createSelector(
  fromFeature.getAppraisalsRootState,
  (state: fromFeature.AppraisalsState) => state.rights
);

// selectors

export const getAppraisalPositionsCheck = createSelector(
  getRightsState,
  fromRights.getAppraisalPositionsCheck
);
