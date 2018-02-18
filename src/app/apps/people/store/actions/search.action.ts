import { Action } from '@ngrx/store';

export const TRIGGER_SEARCH = '[People.Search] Trigger Search';
export const UPDATE_SEARCH_PARAMS = '[People.Search] Update Search Params';
export const START_PEOPLE_SEARCH = '[People.Search] Start Search';
export const FINISH_PEOPLE_SEARCH = '[People.Search] Finish Search';

export const CLEAR_SEARCH_STATE = '[People.Search] Clear State';

export class TriggerSearch implements Action {
  readonly type = TRIGGER_SEARCH;
  constructor(public payload: any) {}
}

export class UpdateSearchParams implements Action {
  readonly type = UPDATE_SEARCH_PARAMS;
  constructor(public payload: any) {}
}

export class StartPeopleSearch implements Action {
  readonly type = START_PEOPLE_SEARCH;
  constructor(public payload: any) {}
}

export class FinishPeopleSearch implements Action {
  readonly type = FINISH_PEOPLE_SEARCH;
}

export class ClearSearchState implements Action {
  readonly type = CLEAR_SEARCH_STATE;
}

export type PeopleSearchActions =
  | TriggerSearch
  | UpdateSearchParams
  | StartPeopleSearch
  | FinishPeopleSearch
  | ClearSearchState;
