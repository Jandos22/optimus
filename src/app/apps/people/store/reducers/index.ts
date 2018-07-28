import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromPeoplePositions from './people-positions.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface PeopleState {
  users: fromUsers.UsersState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
  peoplePositions: fromPeoplePositions.PeoplePositionsState;
}

export const reducers: ActionReducerMap<PeopleState> = {
  users: fromUsers.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer,
  peoplePositions: fromPeoplePositions.reducer
};

export const getPeopleState = createFeatureSelector<PeopleState>('people');
