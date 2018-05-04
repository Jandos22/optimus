import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromApplication from '../reducers/application.reducer';

export const getApplicationName = createSelector(
  fromRoot.getApplicationState,
  fromApplication.getApplicationName
);

export const getApplicationLocation = createSelector(
  fromRoot.getApplicationState,
  fromApplication.getApplicationLocation
);

export const getApplicationLocations = createSelector(
  fromRoot.getApplicationState,
  fromApplication.getApplicationLocations
);

export const getApplicationWorking = createSelector(
  fromRoot.getApplicationState,
  fromApplication.getApplicationWorking
);
