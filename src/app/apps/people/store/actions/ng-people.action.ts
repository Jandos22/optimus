import { Action } from '@ngrx/store';
import { User } from './../../models/user.m';

export const UPDATE_PEOPLE_LIST = '[People] Update People List';
export const ERROR_GET_PEOPLE = '[People.Users] Error Get People';

export class UpdatePeopleList implements Action {
  readonly type = UPDATE_PEOPLE_LIST;
  constructor(public payload: User[]) {}
}

export class ErrorGetPeople implements Action {
  readonly type = ERROR_GET_PEOPLE;
  constructor(public error: any) {}
}

export type NgPeopleActions = UpdatePeopleList | ErrorGetPeople;
