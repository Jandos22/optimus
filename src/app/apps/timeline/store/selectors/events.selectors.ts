import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEvents from '../reducers/events.reducer';

// select sub-feature state
export const getEventsState = createSelector(
  fromFeature.getTimelineState,
  (state: fromFeature.TimelineState) => state.events
);

// selectors

export const getEventsSearching = createSelector(
  getEventsState,
  fromEvents.getEventsSearching
);

export const selectAllEvents = createSelector(
  getEventsState,
  fromEvents.selectAllEvents
);

export const selectTotalDisplayedEvents = createSelector(
  getEventsState,
  fromEvents.selectEventsTotal
);
