import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUsers from '../reducers/users.reducer';

// select feature state
export const getUsersState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.users
);

// selectors

export const getUserList = createSelector(getUsersState, fromUsers.getUserList);
