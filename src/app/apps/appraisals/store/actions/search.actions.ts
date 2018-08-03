import { Action } from '@ngrx/store';

// interfaces
import { AppraisalsSearchParams } from '../../../../shared/interface/appraisals.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Appraisals Search] Get New Url',
  BEGIN_SEARCH = '[Appraisals Search] Begin Search',
  BEGIN_COUNT = '[Appraisals Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: AppraisalsSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: AppraisalsSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
