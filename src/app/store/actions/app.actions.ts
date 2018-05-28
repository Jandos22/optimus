import { Action } from '@ngrx/store';

import { Locations } from './../../models/locations.m';

export const CHANGE_APP_NAME = '[Application] Change App Name';
export const SET_APP_NAME = '[Application] Set App Name';

// get actions
export const GET_LOCATIONS = '[App] Get Locations [req -> NgLocation]';

export const SET_LOCATION = '[Application] Set Location';
export const SET_SELECTED_LOCATION = '[Application] Set Selected Location';

export const SET_LOCATIONS = '[Application] Set Locations';

export const START_WORKING = '[Application] Started Working';
export const FINISH_WORKING = '[Application] Finished Working';

export class ChangeAppName implements Action {
  readonly type = CHANGE_APP_NAME;
  constructor(public payload: string) {}
}

export class SetAppName implements Action {
  readonly type = SET_APP_NAME;
  constructor(public payload: string) {}
}

export class SetLocation implements Action {
  readonly type = SET_LOCATION;
  constructor(public payload: string) {}
}

export class SetSelectedLocation implements Action {
  readonly type = SET_SELECTED_LOCATION;
  constructor(public payload: string) {}
}

export class GetLocations implements Action {
  readonly type = GET_LOCATIONS;
}

export class SetLocations implements Action {
  readonly type = SET_LOCATIONS;
  constructor(public payload: Locations[]) {}
}

export class StartWorking implements Action {
  readonly type = START_WORKING;
}

export class FinishWorking implements Action {
  readonly type = FINISH_WORKING;
}

export type ApplicationActions =
  | ChangeAppName
  | SetAppName
  | SetLocation
  | SetSelectedLocation
  | GetLocations
  | SetLocations
  | StartWorking
  | FinishWorking;
