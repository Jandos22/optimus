import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromUser from '../reducers/user.reducer';

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
