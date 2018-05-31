import { Action } from '@ngrx/store';

export const ERROR = '[ERROR] in Effects';
export const DISPLAY_ERROR = '[ERROR] display error';

export class ErrorInEffects implements Action {
  readonly type = ERROR;
  constructor(public payload: any) {}
}

export class DisplayError implements Action {
  readonly type = DISPLAY_ERROR;
  constructor(public payload: any) {}
}

export type Actions = ErrorInEffects | DisplayError;
