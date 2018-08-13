import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromOrders from '../reducers/orders.reducer';

// select sub-feature state
export const getOrdersState = createSelector(
  fromFeature.getOrdersRootState,
  (state: fromFeature.OrdersState) => state.orders
);

// selectors

export const getOrdersSearching = createSelector(
  getOrdersState,
  fromOrders.getOrdersSearching
);

export const selectAllOrders = createSelector(
  getOrdersState,
  fromOrders.selectAllOrders
);

export const selectTotalDisplayedOrders = createSelector(
  getOrdersState,
  fromOrders.selectOrdersTotal
);
