import { Action } from '@ngrx/store';

// interfaces
import { JobsSearchParams } from '../../../../shared/interface/jobs.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Jobs Search] Get New Url',
  BEGIN_SEARCH = '[Jobs Search] Begin Search',
  BEGIN_COUNT = '[Jobs Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: JobsSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: JobsSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
