import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromBatteries from './batteries.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface BatteriesState {
  batteries: fromBatteries.BatteriesState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<BatteriesState> = {
  batteries: fromBatteries.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getBatteriesRootState = createFeatureSelector<BatteriesState>('batteries');
