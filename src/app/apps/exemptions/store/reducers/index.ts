import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromExemptions from './exemptions.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface ExemptionsState {
  exemptions: fromExemptions.ExemptionsState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<ExemptionsState> = {
  exemptions: fromExemptions.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getExemptionsRootState = createFeatureSelector<ExemptionsState>(
  'exemptions'
);
