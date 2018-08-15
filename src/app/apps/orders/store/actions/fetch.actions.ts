import { Action } from '@ngrx/store';

import { OrderStatus } from '../../../../shared/interface/orders.model';

export enum FetchActionTypes {
  FETCH_ORDER_STATUSES = '[Orders] Fetch Order Statuses',
  FETCH_ORDER_STATUSES_SUCCESS = '[Orders] Fetch Order Statuses Success'
}

export class FetchOrderStatuses implements Action {
  readonly type = FetchActionTypes.FETCH_ORDER_STATUSES;
}

export class FetchOrderStatusesSuccess implements Action {
  readonly type = FetchActionTypes.FETCH_ORDER_STATUSES_SUCCESS;
  constructor(public orderStatuses: OrderStatus[]) {}
}

export type FetchActionsUnion = FetchOrderStatuses | FetchOrderStatusesSuccess;
