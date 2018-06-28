import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPagination from '../reducers/pagination.reducer';

// select feature state
export const getPaginationState = createSelector(
  fromFeature.getTimelineState,
  (state: fromFeature.TimelineState) => state.pagination
);

// selectors

export const getPagination = createSelector(
  getPaginationState,
  fromPagination.getPagination
);

export const getPageIndexes = createSelector(
  getPaginationState,
  fromPagination.getPageIndexes
);

export const getPageCurrentIndex = createSelector(
  getPaginationState,
  fromPagination.getPageCurrentIndex
);

export const getPageLinks = createSelector(
  getPaginationState,
  fromPagination.getPageLinks
);

export const getTotalFound = createSelector(
  getPaginationState,
  fromPagination.getTotalFound
);
