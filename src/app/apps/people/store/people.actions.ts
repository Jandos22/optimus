import { Action } from '@ngrx/store';

export const NAVIGATED_TO_PEOPLE = '[People] Navigated To People';
export const UPDATE_SEARCH_LOCATION = '[People] Update Search Location';

export const SEARCH = '[People] Search';

export const CLEAR_STATE = '[People] Clear State';

export class NavigatedToPeople implements Action {
    readonly type = NAVIGATED_TO_PEOPLE;
}

export class Search implements Action {
    readonly type = SEARCH;
    constructor(public payload: any) {}
}

export class UpdateSelectedLocationInSearch implements Action {
    readonly type = UPDATE_SEARCH_LOCATION;
    constructor(public payload: string) {}
}

export class ClearState implements Action {
    readonly type = CLEAR_STATE;
}

export type Actions
    = NavigatedToPeople
    | Search
    | UpdateSelectedLocationInSearch
    | ClearState;
