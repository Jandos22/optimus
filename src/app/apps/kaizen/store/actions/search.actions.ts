import { Action } from '@ngrx/store';

// interfaces
import { KaizenSearchParams } from '../../../../shared/interface/kaizen.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Kaizen Search] Get New Url',
  BEGIN_SEARCH = '[Kaizen Search] Begin Search',
  BEGIN_COUNT = '[Kaizen Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: KaizenSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: KaizenSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
