import { Action } from '@ngrx/store';

export const HARCS_TRIGGER_SEARCH = '[Harcs] Trigger Search';
export const HARCS_UPDATE_SEARCH_LOCATION = '[Harcs] Update Search Location';
export const HARCS_UPDATE_SEARCH_QUERY = '[Harcs] Update Search Query';
export const HARCS_UPDATE_HARCS_LIST = '[Harcs] Update Harcs List';
export const HARCS_NO_RESULTS = '[Harcs] NO_RESULTS';
export const HARCS_CLEAR_STATE = '[Harcs] Clear State';

export class HarcsTriggerSearch implements Action {
    readonly type = HARCS_TRIGGER_SEARCH;
    constructor(public payload: any) {}
}

export class HarcsUpdateSelectedLocationInSearch implements Action {
    readonly type = HARCS_UPDATE_SEARCH_LOCATION;
    constructor(public payload: string) {}
}

export class HarcsUpdateSearchQuery implements Action {
    readonly type = HARCS_UPDATE_SEARCH_QUERY;
    constructor(public payload: string) {}
}

export class HarcsUpdateHarcsList implements Action {
    readonly type = HARCS_UPDATE_HARCS_LIST;
    constructor(public payload: any) {}
}

export class HarcsNoResults implements Action {
    readonly type = HARCS_NO_RESULTS;
}

export class HarcsClearState implements Action {
    readonly type = HARCS_CLEAR_STATE;
}

export type Actions
= HarcsTriggerSearch
| HarcsUpdateSelectedLocationInSearch
| HarcsUpdateHarcsList
| HarcsNoResults
| HarcsUpdateSearchQuery
| HarcsClearState;
