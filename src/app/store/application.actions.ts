import { Locations } from './../shared/interfaces/locations.model';
import { Action } from '@ngrx/store';

export const CHANGE_APP_NAME = '[Application] Change App Name';
export const SET_APP_NAME = '[Application] Set App Name';
export const SET_LOCATION = '[Application] Set Location';
export const GET_LOCATIONS = '[Application] Get Locations List';
export const SET_LOCATIONS = '[Application] Set Locations List';

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

export class GetLocations implements Action {
    readonly type = GET_LOCATIONS;
    constructor() {}
}

export class SetLocations implements Action {
    readonly type = SET_LOCATIONS;
    constructor(public payload: Locations) {}
}

export type Actions
    = ChangeAppName
    | SetAppName
    | SetLocation
    | GetLocations
    | SetLocations;
