import { Action } from '@ngrx/store';

// interfaces
import { PeopleParams } from '../../models/people-params.model';

// actions
export const ON_PARAMS_CHANGE = '[People] E - On Search Params Change';
export const UPDATE_PARAMS = '[People] Update Params';
export const START_SEARCH_PEOPLE = '[People] Start Search';

// action creators

export class OnParamsChange implements Action {
  readonly type = ON_PARAMS_CHANGE;
  constructor(public params: PeopleParams) {}
}

export class UpdateParams implements Action {
  readonly type = UPDATE_PARAMS;
  constructor(public params: PeopleParams) {}
}

export class StartSearchPeople implements Action {
  readonly type = START_SEARCH_PEOPLE;
  constructor(public url: any) {}
}

export type ParamsActions = OnParamsChange | UpdateParams | StartSearchPeople;
