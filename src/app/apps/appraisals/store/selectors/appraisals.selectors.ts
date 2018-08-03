import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAppraisals from '../reducers/appraisals.reducer';

// select sub-feature state
export const getAppraisalsState = createSelector(
  fromFeature.getAppraisalsRootState,
  (state: fromFeature.AppraisalsState) => state.appraisals
);

// selectors

export const getAppraisalsSearching = createSelector(
  getAppraisalsState,
  fromAppraisals.getAppraisalsSearching
);

export const selectAllAppraisals = createSelector(
  getAppraisalsState,
  fromAppraisals.selectAllAppraisals
);

export const selectTotalDisplayedAppraisals = createSelector(
  getAppraisalsState,
  fromAppraisals.selectAppraisalsTotal
);
