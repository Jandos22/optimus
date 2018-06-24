import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface PeopleState {
  users: fromUsers.UsersState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<PeopleState> = {
  users: fromUsers.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getPeopleState = createFeatureSelector<PeopleState>('people');
