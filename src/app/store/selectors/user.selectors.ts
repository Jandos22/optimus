import { createSelector } from '@ngrx/store';

import * as fromRoot from '../index';
import * as fromUser from '../reducers/user.reducer';
import { UserService } from '../../services';

export const getUserState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.user
);

export const getUsername = createSelector(getUserState, fromUser.getUsername);

export const getEmail = createSelector(getUserState, fromUser.getEmail);

export const getIsRegistered = createSelector(
  getUserState,
  fromUser.getIsRegistered
);
export const getInitials = createSelector(getUserState, fromUser.getInitials);
export const getPhoto = createSelector(getUserState, fromUser.getPhoto);
