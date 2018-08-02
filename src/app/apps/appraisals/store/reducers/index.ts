import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAppraisals from './appraisals.reducer';
import * as fromGroups from './groups.reducer';
import * as fromRights from './rights.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface AppraisalsState {
  appraisals: fromAppraisals.AppraisalsState;
  groups: fromGroups.GroupsState;
  rights: fromRights.RightsState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<AppraisalsState> = {
  appraisals: fromAppraisals.reducer,
  groups: fromGroups.reducer,
  rights: fromRights.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getAppraisalsRootState = createFeatureSelector<AppraisalsState>(
  'appraisals'
);
