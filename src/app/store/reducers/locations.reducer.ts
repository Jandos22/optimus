import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  LocationsActionTypes,
  LocationsActionsUnion
} from '../actions/locations.actions';

// interfaces
import { LocationEnt } from '../../shared/interface/locations.model';

export interface State extends EntityState<LocationEnt> {
  selected: number[];
}

export const adapter: EntityAdapter<LocationEnt> = createEntityAdapter<
  LocationEnt
>({});

export const initialState: State = adapter.getInitialState({
  selected: []
});

export function reducer(
  state = initialState,
  action: LocationsActionsUnion
): State {
  switch (action.type) {
    case LocationsActionTypes.ADD_LOCATIONS: {
      return adapter.addMany(action.payload.locations, state);
    }

    case LocationsActionTypes.UPDATE_LOCATIONS: {
      return adapter.updateMany(action.payload.locations, state);
    }

    case LocationsActionTypes.UPDATE_SELECTED: {
      return {
        ...state,
        selected: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds: selectLocationsIds,
  selectEntities: selectLocationsEntities,
  selectAll: selectAllLocations,
  selectTotal: selectLocationsTotal
} = adapter.getSelectors();

export const selectSelectedId = (state: State) => state.selected;
