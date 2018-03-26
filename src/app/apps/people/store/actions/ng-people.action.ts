import { Action } from '@ngrx/store';
import { User } from './../../models/user.m';

export const SEARCH_TRUE = '[People/NgPeople] R - Searching Started';
export const SEARCH_FALSE = '[People/NgPeople] R - Searching Finished';
export const UPDATE_PEOPLE_LIST = '[People] Update People List';
export const ERROR_GET_PEOPLE = '[People.Users] Error Get People';
export const UPDATE_TOTAL_ITEMS = '[People] Update Total Items';

export class SearchTrue implements Action {
  readonly type = SEARCH_TRUE;
}

export class SearchFalse implements Action {
  readonly type = SEARCH_FALSE;
}

export class UpdatePeopleList implements Action {
  readonly type = UPDATE_PEOPLE_LIST;
  constructor(public payload: User[]) {}
}

export class ErrorGetPeople implements Action {
  readonly type = ERROR_GET_PEOPLE;
  constructor(public error: any) {}
}

export class UpdateTotalItems implements Action {
  readonly type = UPDATE_TOTAL_ITEMS;
  constructor(public total: any) {}
}

export type NgPeopleActions =
  | SearchTrue
  | SearchFalse
  | UpdatePeopleList
  | ErrorGetPeople
  | UpdateTotalItems;
