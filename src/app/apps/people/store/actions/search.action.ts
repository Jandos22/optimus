import { Action } from '@ngrx/store';

// interfaces
import { PeopleSearchParams } from '../../models/people-search-params.model';

// actions
export const ON_SEARCH_PARAMS_CHANGE = '[People] E - On Search Params Change';
export const UPDATE_SEARCH_PARAMS = '[People] Update Search Params';
export const UPDATE_SEARCH_QUERY = '[People] Update Search Query';
export const UPDATE_SEARCH_LOCATION = '[People] Update Search Location';
export const START_SEARCH_PEOPLE = '[People] Start Search';
export const UPDATE_SEARCH_URI_PREVIOUS = '[People] Update Search Uri Previous';
export const UPDATE_SEARCH_URI_CURRENT = '[People] Update Search Uri Current';
export const UPDATE_SEARCH_URI_NEXT = '[People] Update Search Uri Next';

// action creators

export class OnSearchParamsChange implements Action {
  readonly type = ON_SEARCH_PARAMS_CHANGE;
  constructor(public params: PeopleSearchParams) {}
}

export class UpdateSearchParams implements Action {
  readonly type = UPDATE_SEARCH_PARAMS;
  constructor(public params: PeopleSearchParams) {}
}

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
  constructor(public url: any) {}
}

export class UpdateSearchUriPrevious implements Action {
  readonly type = UPDATE_SEARCH_URI_PREVIOUS;
  constructor(public uri: string) {}
}

export class UpdateSearchUriCurrent implements Action {
  readonly type = UPDATE_SEARCH_URI_CURRENT;
  constructor(public uri: string) {}
}

export class UpdateSearchUriNext implements Action {
  readonly type = UPDATE_SEARCH_URI_NEXT;
  constructor(public uri: string) {}
}

export type PeopleSearchActions =
  | UpdateSearchParams
  | UpdateSearchQuery
  | UpdateSearchLocation
  | StartSearchPeople
  | UpdateSearchUriPrevious
  | UpdateSearchUriCurrent
  | UpdateSearchUriNext;
