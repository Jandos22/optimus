import { createSelector } from '@ngrx/store';

import * as fromRoot from '..';
import * as fromLayout from '../reducers/layout.reducer';

export const getLayoutState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.layout
);

export const getLayoutWindow = createSelector(
  getLayoutState,
  fromLayout.getLayoutWindow
);

export const getSidenavState = createSelector(
  getLayoutState,
  fromLayout.getSidenavState
);

export const getSidenavOpened = createSelector(
  getLayoutState,
  fromLayout.getSidenavOpened
);

export const getSidenavMode = createSelector(
  getLayoutState,
  fromLayout.getSidenavMode
);

export const getLockedInClosed = createSelector(
  getLayoutState,
  fromLayout.getLockedInClosed
);
