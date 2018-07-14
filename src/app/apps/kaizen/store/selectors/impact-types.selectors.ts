import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromImpactTypes from '../reducers/impact-types.reducer';

// select sub-feature state
export const getImpactTypesState = createSelector(
  fromFeature.getKaizenState,
  (state: fromFeature.KaizenState) => state.impactTypes
);

// selectors

export const getImpactTypesSearching = createSelector(
  getImpactTypesState,
  fromImpactTypes.getImpactTypesSearching
);

export const getApplicableImpactTypes = createSelector(
  getImpactTypesState,
  fromImpactTypes.getApplicableImpactTypes
);

export const selectAllImpactTypes = createSelector(
  getImpactTypesState,
  fromImpactTypes.selectAllImpactTypes
);

export const selectImpactTypesTotal = createSelector(
  getImpactTypesState,
  fromImpactTypes.selectImpactTypesTotal
);
