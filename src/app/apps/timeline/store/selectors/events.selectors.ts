import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromEvents from '../reducers/events.reducer';

// select sub-feature state
export const getEventsState = createSelector(
  fromFeature.getTimelineState,
  (state: fromFeature.TimelineState) => state.events
);

// selectors

// export const getUsersSearching = createSelector(
//   getUsersState,
//   fromUsers.getUsersSearching
// );

export const selectAllEvents = createSelector(
  getEventsState,
  fromEvents.selectAllEvents
);

// export const getUsersTotal = createSelector(
//     getEventsState,
//   fromUsers.getUsersTotal
// );
