// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  OrdersActionTypes,
  OrdersActionsUnion
} from '../actions/orders.actions';

// interfaces
import { OrderItem } from '../../../../shared/interface/orders.model';

// compose reducer state shape here
export interface OrdersState extends EntityState<OrderItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<OrderItem> = createEntityAdapter<OrderItem>(
  {}
);

// compose initial state here
export const initialState: OrdersState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: OrdersActionsUnion
): OrdersState {
  switch (action.type) {
    case OrdersActionTypes.SEARCH_START: {
      return { ...state, searching: true };
    }

    case OrdersActionTypes.SEARCH_SUCCESS: {
      const adapted = adapter.addAll(action.orders, state);
      return { ...adapted, searching: false };
    }

    case OrdersActionTypes.SEARCH_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case OrdersActionTypes.INSERT_ONE: {
      const order = action.order;
      const ids = [order.ID, ...state.ids] as string[] | number[];
      const entities = { [order.ID]: order, ...state.entities };
      return { ...state, ids, entities };
    }

    case OrdersActionTypes.ADD_ONE: {
      return adapter.addOne(action.order, state);
    }

    case OrdersActionTypes.UPDATE_ONE: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case OrdersActionTypes.DELETE_ONE: {
      return adapter.removeOne(action.id, state);
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectOrdersIds,
  selectEntities: selectOrdersEntities,
  selectAll: selectAllOrders,
  selectTotal: selectOrdersTotal
} = adapter.getSelectors();

export const getOrdersSearching = (state: OrdersState) => state.searching;
