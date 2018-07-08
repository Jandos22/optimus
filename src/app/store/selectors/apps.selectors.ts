import { createSelector } from '@ngrx/store';

import * as fromRoot from '..';
import * as fromApps from '../reducers/apps.reducer';

export const getAppsState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.apps
);

export const getAppName = createSelector(getAppsState, fromApps.getAppName);

export const selectAllApps = createSelector(
  getAppsState,
  fromApps.selectAllApps
);
