import { Action } from '@ngrx/store';

import { PeopleItem } from './../../../../shared/interface/people.model';

export enum UsersActionTypes {
  SEARCH_TRUE = '[People Users] Searching Started',
  SEARCH_FALSE = '[People Users] Searching Finished',
  UPDATE_PEOPLE_LIST = '[People Users] Update People List',
  UPDATE_ONE_USER = '[People Users] Update One User',
  UPDATE_TOTAL_ITEMS = '[People Users] Update Total Items'
}

export class SearchTrue implements Action {
  readonly type = UsersActionTypes.SEARCH_TRUE;
}

export class SearchFalse implements Action {
  readonly type = UsersActionTypes.SEARCH_FALSE;
}

export class UpdatePeopleList implements Action {
  readonly type = UsersActionTypes.UPDATE_PEOPLE_LIST;
  constructor(public users: PeopleItem[]) {}
}

export class UpdateOneUser implements Action {
  readonly type = UsersActionTypes.UPDATE_ONE_USER;
  constructor(public id: number, public changes: PeopleItem) {}
}

export class UpdateTotalItems implements Action {
  readonly type = UsersActionTypes.UPDATE_TOTAL_ITEMS;
  constructor(public total: any) {}
}

export type UsersActionsUnion =
  | SearchTrue
  | SearchFalse
  | UpdatePeopleList
  | UpdateOneUser
  | UpdateTotalItems;
