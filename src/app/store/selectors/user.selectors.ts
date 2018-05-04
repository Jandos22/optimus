import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromUser from '../reducers/user.reducer';

export const getUser = createSelector(fromRoot.getUserState, fromUser.getUser);

export const getUsername = createSelector(
  fromRoot.getUserState,
  fromUser.getUsername
);

export const getEmail = createSelector(
  fromRoot.getUserState,
  fromUser.getEmail
);

export const getIsRegistered = createSelector(
  fromRoot.getUserState,
  fromUser.getIsRegistered
);
export const getInitials = createSelector(
  fromRoot.getUserState,
  fromUser.getInitials
);
export const getPhoto = createSelector(
  fromRoot.getUserState,
  fromUser.getPhoto
);
