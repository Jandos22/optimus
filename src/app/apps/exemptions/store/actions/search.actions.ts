import { Action } from '@ngrx/store';

// interfaces
import { ExemptionsSearchParams } from '../../../../shared/interface/exemptions.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Exemptions Search] Get New Url',
  BEGIN_SEARCH = '[Exemptions Search] Begin Search',
  BEGIN_COUNT = '[Exemptions Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: ExemptionsSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: ExemptionsSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
