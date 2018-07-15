import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromNgExemptions from '../reducers/ng-exemptions.reducer';

// select feature/reducer state
export const getNgExemptionsState = createSelector(
  fromFeature.getExemptionsState,
  (state: fromFeature.ExemptionsState) => {
    return state.NgExemptions;
  }
);

// selectors

export const getExemptionsList = createSelector(
  getNgExemptionsState,
  fromNgExemptions.getExemptionsList
);

export const getGroupedExemptionsList = createSelector(
  getNgExemptionsState,
  fromNgExemptions.getGroupedExemptionsList
);
