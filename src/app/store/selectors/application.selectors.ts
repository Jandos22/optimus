import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromApplication from '../reducers/application.reducer';

export const getAppState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.application
);

export const getApplicationName = createSelector(
  getAppState,
  fromApplication.getApplicationName
);

export const getApplicationLocation = createSelector(
  getAppState,
  fromApplication.getApplicationLocation
);

export const getApplicationLocations = createSelector(
  getAppState,
  fromApplication.getApplicationLocations
);

export const getApplicationWorking = createSelector(
  getAppState,
  fromApplication.getApplicationWorking
);
