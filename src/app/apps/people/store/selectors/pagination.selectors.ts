import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPagination from '../reducers/pagination.reducer';

// select feature state
export const getPaginationState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.pagination
);

// selectors

export const getPagination = createSelector(
  getPaginationState,
  fromPagination.getPagination
);

export const getCurrentIndex = createSelector(
  getPaginationState,
  fromPagination.getCurrentIndex
);

export const getPageLinks = createSelector(
  getPaginationState,
  fromPagination.getPageLinks
);

export const getTotalDisplayed = createSelector(
  getPaginationState,
  fromPagination.getTotalDisplayed
);

export const getTotalExist = createSelector(
  getPaginationState,
  fromPagination.getTotalExist
);
