import { Action } from '@ngrx/store';

export const NAVIGATED_TO_PEOPLE = '[People] Navigated To People';
export const UPDATE_SEARCH_LOCATION = '[People] Update Search Location';
export const UPDATE_SEARCH_QUERY = '[People] Update Search Query';

export const TRIGGER_SEARCH = '[People] Trigger Search';

export const CLEAR_STATE = '[People] Clear State';

export class NavigatedToPeople implements Action {
    readonly type = NAVIGATED_TO_PEOPLE;
}

export class TriggerSearch implements Action {
    readonly type = TRIGGER_SEARCH;
    constructor(public payload: any) {}
}

export class UpdateSelectedLocationInSearch implements Action {
    readonly type = UPDATE_SEARCH_LOCATION;
    constructor(public payload: string) {}
}

export class UpdateSearchQuery implements Action {
    readonly type = UPDATE_SEARCH_QUERY;
    constructor(public payload: string) {}
}

export class ClearState implements Action {
    readonly type = CLEAR_STATE;
}

export type Actions
    = NavigatedToPeople
    | TriggerSearch
    | UpdateSelectedLocationInSearch
    | UpdateSearchQuery
    | ClearState;
