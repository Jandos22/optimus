import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromOrderStatuses from '../reducers/order-statuses.reducer';

// select sub-feature state
export const getOrderStatusesState = createSelector(
  fromFeature.getOrdersRootState,
  (state: fromFeature.OrdersState) => state.orderStatuses
);

// selectors

export const getOrderStatusesSearching = createSelector(
  getOrderStatusesState,
  fromOrderStatuses.getOrderStatusesSearching
);

export const selectAllOrderStatuses = createSelector(
  getOrderStatusesState,
  fromOrderStatuses.selectAllOrderStatuses
);
