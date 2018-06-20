import { Action } from '@ngrx/store';

import { Locations } from './../../models/locations.m';

export const CHANGE_APP_NAME = '[Application] Change App Name';
export const SET_APP_NAME = '[Application] Set App Name';
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

export class StartWorking implements Action {
  readonly type = START_WORKING;
}

export class FinishWorking implements Action {
  readonly type = FINISH_WORKING;
}

export type ApplicationActions =
  | ChangeAppName
  | SetAppName
  | StartWorking
  | FinishWorking;
