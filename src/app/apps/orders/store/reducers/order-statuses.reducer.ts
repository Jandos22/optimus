// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import { FetchActionTypes, FetchActionsUnion } from '../actions/fetch.actions';

// interfaces
import { OrderStatus } from '../../../../shared/interface/orders.model';

// compose reducer state shape here
export interface OrderStatusesState extends EntityState<OrderStatus> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<OrderStatus> = createEntityAdapter<
  OrderStatus
>({});

// compose initial state here
export const initialState: OrderStatusesState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: FetchActionsUnion
): OrderStatusesState {
  switch (action.type) {
    case FetchActionTypes.FETCH_ORDER_STATUSES: {
      return { ...state, searching: true };
    }

    case FetchActionTypes.FETCH_ORDER_STATUSES_SUCCESS: {
      const adapted = adapter.addAll(action.orderStatuses, state);
      return { ...adapted, searching: false };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectOrderStatusesIds,
  selectEntities: selectOrderStatusesEntities,
  selectAll: selectAllOrderStatuses
} = adapter.getSelectors();

export const getOrderStatusesSearching = (state: OrderStatusesState) =>
  state.searching;
