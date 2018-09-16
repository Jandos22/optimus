import { Action } from '@ngrx/store';

import { OrderItem } from '../../../../shared/interface/orders.model';

export enum OrdersActionTypes {
  SEARCH_START = '[Orders] Search Start',
  SEARCH_SUCCESS = '[Orders] Search Success',
  SEARCH_NO_RESULTS = '[Orders] Search No Results',
  COUNT_TOTAL = '[Orders] Count Total (since next url is present)',
  ADD_ONE = '[Orders] Add One Order',
  INSERT_ONE = '[Orders] Insert One Order (in beginning)',
  UPDATE_ONE = '[Orders] Update One Order',
  DELETE_ONE = '[Orders] Delete One'
}

export class SearchOrdersStart implements Action {
  readonly type = OrdersActionTypes.SEARCH_START;
  constructor(public url: string) {}
}

export class SearchOrdersSuccess implements Action {
  readonly type = OrdersActionTypes.SEARCH_SUCCESS;
  constructor(public orders: OrderItem[]) {}
}

export class SearchOrdersNoResults implements Action {
  readonly type = OrdersActionTypes.SEARCH_NO_RESULTS;
}

export class CountOrdersTotal implements Action {
  readonly type = OrdersActionTypes.COUNT_TOTAL;
}

export class AddOneOrder implements Action {
  readonly type = OrdersActionTypes.ADD_ONE;
  constructor(public order: OrderItem) {}
}

export class InsertOneOrder implements Action {
  readonly type = OrdersActionTypes.INSERT_ONE;
  constructor(public order: OrderItem) {}
}

export class UpdateOneOrder implements Action {
  readonly type = OrdersActionTypes.UPDATE_ONE;
  constructor(public id: number, public changes: OrderItem) {}
}

export class DeleteOne implements Action {
  readonly type = OrdersActionTypes.DELETE_ONE;
  constructor(public id: number) {}
}

export type OrdersActionsUnion =
  | SearchOrdersStart
  | SearchOrdersSuccess
  | SearchOrdersNoResults
  | CountOrdersTotal
  | AddOneOrder
  | InsertOneOrder
  | UpdateOneOrder
  | DeleteOne;
