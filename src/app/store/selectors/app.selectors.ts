import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromApp from '../reducers/app.reducer';

export const getAppState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.app
);

export const getAppName = createSelector(getAppState, fromApp.getAppName);
export const getAppWorking = createSelector(getAppState, fromApp.getAppWorking);
