// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import { BatteriesActionTypes, BatteriesActionsUnion } from '../actions/batteries.actions';

// interfaces
import { BatteryItem } from '../../../../shared/interface/batteries.model';

// compose reducer state shape here
export interface BatteriesState extends EntityState<BatteryItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<BatteryItem> = createEntityAdapter<BatteryItem>({});

// compose initial state here
export const initialState: BatteriesState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: BatteriesActionsUnion
): BatteriesState {
  switch (action.type) {
    case BatteriesActionTypes.SEARCH_BATTERIES_START: {
      return { ...state, searching: true };
    }

    case BatteriesActionTypes.SEARCH_BATTERIES_SUCCESS: {
      const adapted = adapter.addAll(action.batteries, state);
      return { ...adapted, searching: false };
    }

    case BatteriesActionTypes.SEARCH_BATTERIES_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case BatteriesActionTypes.INSERT_ONE_BATTERY: {
      const battery = action.battery;
      const ids = [battery.ID, ...state.ids] as string[] | number[];
      const entities = { [battery.ID]: battery, ...state.entities };
      return { ...state, ids, entities };
    }

    case BatteriesActionTypes.ADD_ONE_BATTERY: {
      return adapter.addOne(action.battery, state);
    }

    case BatteriesActionTypes.UPDATE_ONE_BATTERY: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectBatteriesIds,
  selectEntities: selectBatteriesEntities,
  selectAll: selectAllBatteries,
  selectTotal: selectBatteriesTotal
} = adapter.getSelectors();

export const getBatteriesSearching = (state: BatteriesState) => state.searching;
