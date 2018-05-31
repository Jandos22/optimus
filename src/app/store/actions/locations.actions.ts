import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

// interface
import { LocationEnt } from '../../shared/interface/locations.model';

export enum LocationsActionTypes {
  GET_LOCATIONS = '[Location] Get Locations',
  ADD_LOCATIONS = '[Location] Add Locations',
  UPDATE_LOCATIONS = '[Location] Update Locations',
  UPDATE_SELECTED = '[Location] Update Selected Locations',
  UPDATE_SELECTED_SUCCESS = '[Location] Update Selected Locations Success'
}

export class GetLocations implements Action {
  readonly type = LocationsActionTypes.GET_LOCATIONS;
}

export class AddLocations implements Action {
  readonly type = LocationsActionTypes.ADD_LOCATIONS;
  constructor(public payload: { locations: LocationEnt[] }) {}
}

export class UpdateLocations implements Action {
  readonly type = LocationsActionTypes.UPDATE_LOCATIONS;
  constructor(public payload: { locations: Update<LocationEnt>[] }) {}
}

export class UpdateSelected implements Action {
  readonly type = LocationsActionTypes.UPDATE_SELECTED;
  constructor(public payload: number[]) {}
}

export class UpdateSelectedSuccess implements Action {
  readonly type = LocationsActionTypes.UPDATE_SELECTED_SUCCESS;
}

export type LocationsActionsUnion =
  | GetLocations
  | AddLocations
  | UpdateLocations
  | UpdateSelected
  | UpdateSelectedSuccess;
