import { createSelector } from '@ngrx/store';

import * as fromRoot from '..';
import * as fromErrors from '../reducers/errors.reducer';

export const getErrorsState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.errors
);

export const getErrorsList = createSelector(
  getErrorsState,
  fromErrors.getErrorsList
);
