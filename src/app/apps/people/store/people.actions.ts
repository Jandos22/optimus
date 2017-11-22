import { Action } from '@ngrx/store';
import { PeopleSearch } from '../model/people-search.model';

export const PEOPLE_PROCESS_NEW_SEARCH_PARAMS = '[People] Process New Search Params';
export const PEOPLE_UPDATE_SEARCH_LOCATION = '[People] Update Search Location';
export const PEOPLE_UPDATE_SEARCH_QUERY = '[People] Update Search Query';
export const PEOPLE_TRIGGER_SEARCH = '[People] Trigger Search';
export const PEOPLE_UPDATE_PEOPLE_LIST = '[People] Update People List';
export const PEOPLE_NO_RESULTS = '[People] No Results';
export const PEOPLE_CLEAR_STATE = '[People] Clear State';

export class PeopleTriggerSearch implements Action {
    readonly type = PEOPLE_TRIGGER_SEARCH;
    constructor(public payload: any) {}
}

export class PeopleUpdatePeopleList implements Action {
    readonly type = PEOPLE_UPDATE_PEOPLE_LIST;
    constructor(public payload: any) {}
}

export class PeopleNoResults implements Action {
    readonly type = PEOPLE_NO_RESULTS;
}

export class PeopleProcessNewSearchParams implements Action {
    readonly type = PEOPLE_PROCESS_NEW_SEARCH_PARAMS;
    constructor(public payload: any) {}
}

export class PeopleUpdateSelectedLocationInSearch implements Action {
    readonly type = PEOPLE_UPDATE_SEARCH_LOCATION;
    constructor(public payload: string) {}
}

export class PeopleUpdateSearchQuery implements Action {
    readonly type = PEOPLE_UPDATE_SEARCH_QUERY;
    constructor(public payload: string) {}
}

export class PeopleClearState implements Action {
    readonly type = PEOPLE_CLEAR_STATE;
}

export type Actions
    = PeopleProcessNewSearchParams
    | PeopleTriggerSearch
    | PeopleUpdatePeopleList
    | PeopleNoResults
    | PeopleUpdateSelectedLocationInSearch
    | PeopleUpdateSearchQuery
    | PeopleClearState;
