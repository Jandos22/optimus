import { PeopleSearch } from './../../people/model/people-search.model';
import { Action } from '@ngrx/store';
import { HarcsSearch } from '../model/harcs-search.model';

export const UPDATE_SEARCH_PARAMS = '[Harcs] Update Search Params';
export const TRIGGER_SEARCH = '[Harcs] Trigger Search';
export const UPDATE_HARCS_LIST = '[Harcs] Update Harcs List';
export const NO_RESULTS = '[Harcs] NO_RESULTS';
export const CLEAR_STATE = '[Harcs] Clear State';

export class UpdateSearchParams implements Action {
    readonly type = UPDATE_SEARCH_PARAMS;
    constructor(public params: PeopleSearch) {}
}

export class TriggerSearch implements Action {
    readonly type = TRIGGER_SEARCH;
    constructor(public params: HarcsSearch) {}
}

export class UpdateHarcsList implements Action {
    readonly type = UPDATE_HARCS_LIST;
    constructor(public payload: any) {}
}

export class NoResults implements Action {
    readonly type = NO_RESULTS;
}

export class ClearState implements Action {
    readonly type = CLEAR_STATE;
}

export type Actions
= TriggerSearch
| UpdateSearchParams
| UpdateHarcsList
| NoResults
| ClearState;
