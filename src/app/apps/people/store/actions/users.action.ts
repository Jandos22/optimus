import { Action } from '@ngrx/store';
import { User } from './../../models/user.m';

export const LOAD_USERS_SUCCESS = '[People.Users] Load Users Success';
export const LOAD_USERS_FAIL = '[People.Users] Load Users Fail';
export const CLEAR_USERS_STATE = '[People.Users] Clear State';

export class LoadUsersSuccess implements Action {
  readonly type = LOAD_USERS_SUCCESS;
  constructor(public payload: User[]) {}
}

export class LoadUsersFail implements Action {
  readonly type = LOAD_USERS_FAIL;
  constructor(public payload: any) {}
}

export class ClearUsersState implements Action {
  readonly type = CLEAR_USERS_STATE;
}

export type PeopleUsersActions =
  | LoadUsersSuccess
  | LoadUsersFail
  | ClearUsersState;
