import { Action } from '@ngrx/store';

// interfaces
import { OrdersSearchParams } from '../../../../shared/interface/orders.model';

// actions
export enum SearchActionTypes {
  GET_NEW_URL = '[Orders Search] Get New Url',
  BEGIN_SEARCH = '[Orders Search] Begin Search',
  BEGIN_COUNT = '[Orders Search] Begin Count'
}

// action creators

export class GetNewUrl implements Action {
  readonly type = SearchActionTypes.GET_NEW_URL;
  constructor(public params: OrdersSearchParams) {}
}

export class BeginSearch implements Action {
  readonly type = SearchActionTypes.BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = SearchActionTypes.BEGIN_COUNT;
  constructor(public params: OrdersSearchParams) {}
}

export type SearchActionsUnion = GetNewUrl | BeginSearch | BeginCount;
