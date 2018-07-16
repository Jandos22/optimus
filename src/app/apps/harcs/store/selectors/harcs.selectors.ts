import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromHarcs from '../reducers/harcs.reducer';

// select sub-feature state
export const getHarcsState = createSelector(
  fromFeature.getHarcsRootState,
  (state: fromFeature.HarcsState) => state.harcs
);

// selectors

export const getHarcsSearching = createSelector(
  getHarcsState,
  fromHarcs.getHarcsSearching
);

export const selectAllHarcs = createSelector(
  getHarcsState,
  fromHarcs.selectAllHarcs
);

export const selectTotalDisplayedHarcs = createSelector(
  getHarcsState,
  fromHarcs.selectHarcsTotal
);
