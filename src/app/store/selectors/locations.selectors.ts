import { createSelector } from '@ngrx/store';

import * as fromRoot from '..';
import * as fromLocations from '../reducers/locations.reducer';

export const getLocationsState = createSelector(
  fromRoot.getRootState,
  (state: fromRoot.RootState) => state.locations
);

export const selectLocationsIds = createSelector(
  getLocationsState,
  fromLocations.selectLocationsIds
);

export const selectLocationsEntities = createSelector(
  getLocationsState,
  fromLocations.selectLocationsEntities
);

export const selectAllLocations = createSelector(
  getLocationsState,
  fromLocations.selectAllLocations
);

export const selectLocationsTotal = createSelector(
  getLocationsState,
  fromLocations.selectLocationsTotal
);

export const getLocationById = (id: number) =>
  createSelector(selectLocationsEntities, entities => {
    // console.log(entities);
    // console.log(id);
    return entities[id];
  });

export const selectSelectedId = createSelector(
  getLocationsState,
  fromLocations.selectSelectedId
);

export const selectLocationsSelectedIds = createSelector(
  getLocationsState,
  fromLocations.selectSelectedId
);

export const getSelectedLocations = createSelector(
  selectLocationsEntities,
  selectSelectedId,
  (locationEntities, selectedIds) => selectedIds.map(id => locationEntities[id])
);
