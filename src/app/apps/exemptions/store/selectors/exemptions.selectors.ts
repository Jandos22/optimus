import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromExemptions from '../reducers/exemptions.reducer';

// select sub-feature state
export const getExemptionsState = createSelector(
  fromFeature.getExemptionsRootState,
  (state: fromFeature.ExemptionsState) => state.exemptions
);

// selectors

export const getExemptionsSearching = createSelector(
  getExemptionsState,
  fromExemptions.getExemptionsSearching
);

export const selectAllExemptions = createSelector(
  getExemptionsState,
  fromExemptions.selectAllExemptions
);

export const selectTotalDisplayedExemptions = createSelector(
  getExemptionsState,
  fromExemptions.selectExemptionsTotal
);
