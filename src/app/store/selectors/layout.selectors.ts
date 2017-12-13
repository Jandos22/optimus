import { createSelector } from '@ngrx/store';

import * as fromRoot from '../';
import * as fromLayout from '../reducers/layout.reducer';

export const getWindowState = createSelector(
  fromRoot.getLayoutState,
  fromLayout.getWindowState
);

export const getSidenavState = createSelector(
  fromRoot.getLayoutState,
  fromLayout.getSidenavState
);

export const getSidenavOpened = createSelector(
  fromRoot.getLayoutState,
  fromLayout.getSidenavOpened
);

export const getSidenavMode = createSelector(
  fromRoot.getLayoutState,
  fromLayout.getSidenavMode
);

export const getLockedInClosed = createSelector(
  fromRoot.getLayoutState,
  fromLayout.getLockedInClosed
);
