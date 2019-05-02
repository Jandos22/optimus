import { Action } from '@ngrx/store';

// interfaces
import { BatteriesSearchParams } from '../../../../shared/interface/batteries.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Batteries Search] Get New Url',
  BEGIN_SEARCH = '[Batteries Search] Begin Search',
  BEGIN_COUNT = '[Batteries Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: BatteriesSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: BatteriesSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
