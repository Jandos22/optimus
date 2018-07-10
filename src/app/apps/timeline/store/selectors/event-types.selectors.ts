import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEventTypes from '../reducers/event-types.reducer';

// select sub-feature state
export const getEventTypesState = createSelector(
  fromFeature.getTimelineState,
  (state: fromFeature.TimelineState) => state.eventTypes
);

// selectors

export const getEventTypesSearching = createSelector(
  getEventTypesState,
  fromEventTypes.getEventTypesSearching
);

export const getApplicableEventTypes = createSelector(
  getEventTypesState,
  fromEventTypes.getApplicableEventTypes
);

export const selectAllEventTypes = createSelector(
  getEventTypesState,
  fromEventTypes.selectAllEventTypes
);

export const selectEventTypesTotal = createSelector(
  getEventTypesState,
  fromEventTypes.selectEventTypesTotal
);
