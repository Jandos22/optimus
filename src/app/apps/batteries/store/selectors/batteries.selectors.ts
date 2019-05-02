import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromBatteries from '../reducers/batteries.reducer';

// select sub-feature state
export const getBatteriesState = createSelector(
  fromFeature.getBatteriesRootState,
  (state: fromFeature.BatteriesState) => state.batteries
);

// selectors

export const getBatteriesSearching = createSelector(
  getBatteriesState,
  fromBatteries.getBatteriesSearching
);

export const selectAllBatteries = createSelector(
  getBatteriesState,
  fromBatteries.selectAllBatteries
);

export const selectTotalDisplayedBatteries = createSelector(
  getBatteriesState,
  fromBatteries.selectBatteriesTotal
);
