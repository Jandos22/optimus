import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromHarcs from './harcs.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface HarcsState {
  harcs: fromHarcs.HarcsState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<HarcsState> = {
  harcs: fromHarcs.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getHarcsRootState = createFeatureSelector<HarcsState>('harcs');
