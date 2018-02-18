import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsers from './users.reducer';
import * as fromSearch from './search.reducer';

export interface PeopleState {
  users: fromUsers.UsersState;
  search: fromSearch.SearchState;
}

export const reducers: ActionReducerMap<PeopleState> = {
  users: fromUsers.reducer,
  search: fromSearch.reducer
};

export const getPeopleState = createFeatureSelector<PeopleState>('people');
