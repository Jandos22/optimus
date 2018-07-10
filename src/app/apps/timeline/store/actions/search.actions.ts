import { Action } from '@ngrx/store';

// interfaces
import { TimelineSearchParams } from '../../../../shared/interface/timeline.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Timeline Search] Get New Url',
  BEGIN_SEARCH = '[Timeline Search] Begin Search',
  BEGIN_COUNT = '[Timeline Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: TimelineSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: TimelineSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
