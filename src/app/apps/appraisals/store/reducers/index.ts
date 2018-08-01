import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAppraisals from './appraisals.reducer';
import * as fromGroups from './groups.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface AppraisalsState {
  appraisals: fromAppraisals.AppraisalsState;
  groups: fromGroups.GroupsState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<AppraisalsState> = {
  appraisals: fromAppraisals.reducer,
  groups: fromGroups.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getAppraisalsRootState = createFeatureSelector<AppraisalsState>(
  'appraisals'
);
