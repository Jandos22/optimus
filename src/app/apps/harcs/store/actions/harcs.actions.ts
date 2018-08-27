import { Action } from '@ngrx/store';

import { HarcItem } from '../../../../shared/interface/harcs.model';

export enum HarcsActionTypes {
  SEARCH_HARCS_START = '[Harcs] Search Harcs Start',
  SEARCH_HARCS_SUCCESS = '[Harcs] Search Harcs Success',
  SEARCH_HARCS_NO_RESULTS = '[Harcs] Search Harcs No Results',
  COUNT_HARCS_TOTAL = '[Harcs] Count Total (since next url is present)',
  ADD_ONE_HARC = '[Harcs] Add One Harc',
  INSERT_ONE_HARC = '[Harcs] Insert One Harc (in beginning)',
  UPDATE_ONE_HARC = '[Harcs] Update One Harc',
  DELETE_ONE_HARC = '[Harcs] Delete One'
}

export class SearchHarcsStart implements Action {
  readonly type = HarcsActionTypes.SEARCH_HARCS_START;
  constructor(public url: string) {}
}

export class SearchHarcsSuccess implements Action {
  readonly type = HarcsActionTypes.SEARCH_HARCS_SUCCESS;
  constructor(public harcs: HarcItem[]) {}
}

export class SearchHarcsNoResults implements Action {
  readonly type = HarcsActionTypes.SEARCH_HARCS_NO_RESULTS;
}

export class CountHarcsTotal implements Action {
  readonly type = HarcsActionTypes.COUNT_HARCS_TOTAL;
}

export class AddOneHarc implements Action {
  readonly type = HarcsActionTypes.ADD_ONE_HARC;
  constructor(public harc: HarcItem) {}
}

export class InsertOneHarc implements Action {
  readonly type = HarcsActionTypes.INSERT_ONE_HARC;
  constructor(public harc: HarcItem) {}
}

export class UpdateOneHarc implements Action {
  readonly type = HarcsActionTypes.UPDATE_ONE_HARC;
  constructor(public id: number, public changes: HarcItem) {}
}

export class DeleteOne implements Action {
  readonly type = HarcsActionTypes.DELETE_ONE_HARC;
  constructor(public id: number) {}
}

export type HarcsActionsUnion =
  | SearchHarcsStart
  | SearchHarcsSuccess
  | SearchHarcsNoResults
  | CountHarcsTotal
  | AddOneHarc
  | InsertOneHarc
  | UpdateOneHarc
  | DeleteOne;
