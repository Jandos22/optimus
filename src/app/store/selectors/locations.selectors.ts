import { createSelector } from '@ngrx/store';

import * as fromRoot from '../index';
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

export const selectSelectedId = createSelector(
  getLocationsState,
  fromLocations.selectSelectedId
);

export const getSelectedLocations = createSelector(
  selectLocationsEntities,
  selectSelectedId,
  (locationEntities, selectedIds) => selectedIds.map(id => locationEntities[id])
);