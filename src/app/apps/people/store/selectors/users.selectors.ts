import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUsers from '../reducers/users.reducer';

// select feature state
export const getUsersState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.users
);

// selectors

export const getUsersSearching = createSelector(
  getUsersState,
  fromUsers.getUsersSearching
);

export const selectAllUsers = createSelector(
  getUsersState,
  fromUsers.selectAllUsers
);

export const selectTotalDisplayedEvents = createSelector(
  getUsersState,
  fromUsers.selectUsersTotal
);
