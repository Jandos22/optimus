import { Action } from '@ngrx/store';
import { PeopleSearch } from '../model/people-search.model';

export const UPDATE_SEARCH_PARAMS = '[People] Update Search Params';
export const TRIGGER_SEARCH = '[People] Trigger Search';
export const UPDATE_PEOPLE_LIST = '[People] Update People List';
export const NO_RESULTS = '[People] No Results';
export const CLEAR_STATE = '[People] Clear State';

export class TriggerSearch implements Action {
    readonly type = TRIGGER_SEARCH;
    constructor(public params: PeopleSearch) {}
}

export class UpdatePeopleList implements Action {
    readonly type = UPDATE_PEOPLE_LIST;
    constructor(public payload: any) {}
}

export class NoResults implements Action {
    readonly type = NO_RESULTS;
}

export class UpdateSearchParams implements Action {
    readonly type = UPDATE_SEARCH_PARAMS;
    constructor(public params: PeopleSearch) {}
}

export class ClearState implements Action {
    readonly type = CLEAR_STATE;
}

export type Actions
    = TriggerSearch
    | UpdatePeopleList
    | NoResults
    | UpdateSearchParams
    | ClearState;
