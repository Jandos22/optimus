import { Action } from '@ngrx/store';

// interfaces
import { PeopleParams } from './../../models/people-params.model';

// actions
export const GET_NEW_URL = '[People] E - Get New Url';
export const BEGIN_SEARCH = '[People] E/R - Begin Search';
export const BEGIN_COUNT = '[People] E/R - Begin Count';

// action creators

export class GetNewUrl implements Action {
  readonly type = GET_NEW_URL;
  constructor(public params: PeopleParams) {}
}

export class BeginSearch implements Action {
  readonly type = BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = BEGIN_COUNT;
  constructor(public params: PeopleParams) {}
}

export type SearchActions = GetNewUrl | BeginSearch | BeginCount;
