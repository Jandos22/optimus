import { Action } from '@ngrx/store';

export const GET_CURRENT_USER = '[User] Get Current User';
export const SET_CURRENT_USER = '[User] Set Current User';
export const CHECK_CURRENT_USER = '[User] Check Current User';
export const SET_OPTIMUS_USER = '[User] Set Optimus User';

export class GetCurrentUser implements Action {
    readonly type = GET_CURRENT_USER;
}

export class SetCurrentUser implements Action {
    readonly type = SET_CURRENT_USER;
    constructor(public payload: any) {}
}

export class CheckCurrentUser implements Action {
    readonly type = CHECK_CURRENT_USER;
    constructor(public payload: string) {}
}

export class SetOptimusUser implements Action {
    readonly type = SET_OPTIMUS_USER;
    constructor(public payload: any) {}
}

export type Actions
= GetCurrentUser
| SetCurrentUser
| CheckCurrentUser
| SetOptimusUser;
