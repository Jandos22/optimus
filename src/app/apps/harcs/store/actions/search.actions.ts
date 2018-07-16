import { Action } from '@ngrx/store';

// interfaces
import { HarcsSearchParams } from '../../../../shared/interface/harcs.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Harcs Search] Get New Url',
  BEGIN_SEARCH = '[Harcs Search] Begin Search',
  BEGIN_COUNT = '[Harcs Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: HarcsSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: HarcsSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
