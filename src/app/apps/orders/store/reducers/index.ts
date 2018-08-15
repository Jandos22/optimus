import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromOrders from './orders.reducer';
import * as fromOrderStatuses from './order-statuses.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface OrdersState {
  orders: fromOrders.OrdersState;
  orderStatuses: fromOrderStatuses.OrderStatusesState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<OrdersState> = {
  orders: fromOrders.reducer,
  orderStatuses: fromOrderStatuses.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getOrdersRootState = createFeatureSelector<OrdersState>('orders');
