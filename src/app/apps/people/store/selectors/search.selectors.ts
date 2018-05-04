import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromParams from '../reducers/params.reducer';

// select feature state
export const getParamsState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.params
);

// selectors

export const getParams = createSelector(getParamsState, fromParams.getParams);
