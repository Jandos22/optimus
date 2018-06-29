import { Action } from '@ngrx/store';

import { Locations } from './../../models/locations.m';

export const CHANGE_APP_NAME = '[Application] Change App Name';
export const SET_APP_NAME = '[Application] Set App Name';

export class ChangeAppName implements Action {
  readonly type = CHANGE_APP_NAME;
  constructor(public payload: string) {}
}

export class SetAppName implements Action {
  readonly type = SET_APP_NAME;
  constructor(public payload: string) {}
}

export type ApplicationActions = ChangeAppName | SetAppName;
