import { Action } from '@ngrx/store';

export const TRIGGER_SEARCH = '[People.Search] Trigger Search';
export const UPDATE_SEARCH_PARAMS = '[People.Search] Update Search Params';
export const UPDATE_SEARCH_QUERY = '[People] Update Search Query';
export const UPDATE_SEARCH_LOCATION = '[People] Update Search Location';
export const START_SEARCH_PEOPLE = '[People] Start Search';
export const FINISH_PEOPLE_SEARCH = '[People.Search] Finish Search';

export const CLEAR_SEARCH_STATE = '[People.Search] Clear State';

export class UpdateSearchQuery implements Action {
  readonly type = UPDATE_SEARCH_QUERY;
  constructor(public query: string) {}
}

export class UpdateSearchLocation implements Action {
  readonly type = UPDATE_SEARCH_LOCATION;
  constructor(public location: string) {}
}

export class StartSearchPeople implements Action {
  readonly type = START_SEARCH_PEOPLE;
  constructor(public payload: any) {}
}

export class FinishPeopleSearch implements Action {
  readonly type = FINISH_PEOPLE_SEARCH;
}

export class ClearSearchState implements Action {
  readonly type = CLEAR_SEARCH_STATE;
}

export type PeopleSearchActions =
  | UpdateSearchQuery
  | UpdateSearchLocation
  | StartSearchPeople
  | FinishPeopleSearch
  | ClearSearchState;
