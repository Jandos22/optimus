import { Action } from '@ngrx/store';

import { PeopleItem } from '../../../../shared/interface/people.model';

export enum UsersActionTypes {
  SEARCH_USERS_START = '[People Users] Search Users Start',
  SEARCH_USERS_SUCCESS = '[People Users] Search Users Success',
  SEARCH_USERS_NO_RESULTS = '[People Users] Search Users No Results',
  COUNT_USERS_TOTAL = '[People Users] Count Total (since next url is present)',
  ADD_ONE_USER = '[People Users] Add One User',
  INSERT_ONE_USER = '[People Users] Insert One User (in beginning)',
  UPDATE_ONE_USER = '[People Users] Update One User'
}

export class SearchUsersStart implements Action {
  readonly type = UsersActionTypes.SEARCH_USERS_START;
  constructor(public url: string) {}
}

export class SearchUsersSuccess implements Action {
  readonly type = UsersActionTypes.SEARCH_USERS_SUCCESS;
  constructor(public users: PeopleItem[]) {}
}

export class SearchUsersNoResults implements Action {
  readonly type = UsersActionTypes.SEARCH_USERS_NO_RESULTS;
}

export class CountUsersTotal implements Action {
  readonly type = UsersActionTypes.COUNT_USERS_TOTAL;
}

export class AddOneUser implements Action {
  readonly type = UsersActionTypes.ADD_ONE_USER;
  constructor(public user: PeopleItem) {}
}

export class InsertOneUser implements Action {
  readonly type = UsersActionTypes.INSERT_ONE_USER;
  constructor(public user: PeopleItem) {}
}

export class UpdateOneUser implements Action {
  readonly type = UsersActionTypes.UPDATE_ONE_USER;
  constructor(public id: number, public changes: PeopleItem) {}
}

export type UsersActionsUnion =
  | AddOneUser
  | InsertOneUser
  | SearchUsersStart
  | SearchUsersSuccess
  | SearchUsersNoResults
  | CountUsersTotal
  | UpdateOneUser;
