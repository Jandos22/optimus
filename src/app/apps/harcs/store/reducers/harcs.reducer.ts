// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import { HarcsActionTypes, HarcsActionsUnion } from '../actions/harcs.actions';

// interfaces
import { HarcItem } from '../../../../shared/interface/harcs.model';

// compose reducer state shape here
export interface HarcsState extends EntityState<HarcItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<HarcItem> = createEntityAdapter<HarcItem>(
  {}
);

// compose initial state here
export const initialState: HarcsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: HarcsActionsUnion
): HarcsState {
  switch (action.type) {
    case HarcsActionTypes.SEARCH_HARCS_START: {
      return { ...state, searching: true };
    }

    case HarcsActionTypes.SEARCH_HARCS_SUCCESS: {
      const adapted = adapter.addAll(action.harcs, state);
      return { ...adapted, searching: false };
    }

    case HarcsActionTypes.SEARCH_HARCS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case HarcsActionTypes.INSERT_ONE_HARC: {
      const harc = action.harc;
      const ids = [harc.ID, ...state.ids] as string[] | number[];
      const entities = { [harc.ID]: harc, ...state.entities };
      return { ...state, ids, entities };
    }

    case HarcsActionTypes.ADD_ONE_HARC: {
      return adapter.addOne(action.harc, state);
    }

    case HarcsActionTypes.UPDATE_ONE_HARC: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case HarcsActionTypes.DELETE_ONE_HARC: {
      return adapter.removeOne(action.id, state);
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectHarcsIds,
  selectEntities: selectHarcsEntities,
  selectAll: selectAllHarcs,
  selectTotal: selectHarcsTotal
} = adapter.getSelectors();

export const getHarcsSearching = (state: HarcsState) => state.searching;
