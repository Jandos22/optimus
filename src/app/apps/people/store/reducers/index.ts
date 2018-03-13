import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromNgPeople from './ng-people.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface PeopleState {
  NgPeople: fromNgPeople.NgPeopleState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<PeopleState> = {
  NgPeople: fromNgPeople.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getPeopleState = createFeatureSelector<PeopleState>('people');
