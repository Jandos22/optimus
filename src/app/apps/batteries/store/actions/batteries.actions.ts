import { Action } from "@ngrx/store";

import { BatteryItem } from "../../../../shared/interface/batteries.model";

export enum BatteriesActionTypes {
  SEARCH_BATTERIES_START = "[Batteries] Search Batteries Start",
  SEARCH_BATTERIES_SUCCESS = "[Batteries] Search Batteries Success",
  SEARCH_BATTERIES_NO_RESULTS = "[Batteries] Search Batteries No Results",
  COUNT_BATTERIES_TOTAL = "[Batteries] Count Total (since next url is present)",
  ADD_ONE_BATTERY = "[Batteries] Add One Battery",
  INSERT_ONE_BATTERY = "[Batteries] Insert One Battery (in beginning)",
  UPDATE_ONE_BATTERY = "[Batteries] Update One Battery",
  DELETE_ONE = "[Batteries] Delete One"
}

export class SearchBatteriesStart implements Action {
  readonly type = BatteriesActionTypes.SEARCH_BATTERIES_START;
  constructor(public url: string) {}
}

export class SearchBatteriesSuccess implements Action {
  readonly type = BatteriesActionTypes.SEARCH_BATTERIES_SUCCESS;
  constructor(public batteries: BatteryItem[]) {}
}

export class SearchBatteriesNoResults implements Action {
  readonly type = BatteriesActionTypes.SEARCH_BATTERIES_NO_RESULTS;
}

export class CountBatteriesTotal implements Action {
  readonly type = BatteriesActionTypes.COUNT_BATTERIES_TOTAL;
}

export class AddOneBattery implements Action {
  readonly type = BatteriesActionTypes.ADD_ONE_BATTERY;
  constructor(public battery: BatteryItem) {}
}

export class InsertOneBattery implements Action {
  readonly type = BatteriesActionTypes.INSERT_ONE_BATTERY;
  constructor(public battery: BatteryItem) {}
}

export class UpdateOneBattery implements Action {
  readonly type = BatteriesActionTypes.UPDATE_ONE_BATTERY;
  constructor(public id: number, public changes: BatteryItem) {}
}

export class DeleteOne implements Action {
  readonly type = BatteriesActionTypes.DELETE_ONE;
  constructor(public id: number) {}
}

export type BatteriesActionsUnion =
  | SearchBatteriesStart
  | SearchBatteriesSuccess
  | SearchBatteriesNoResults
  | CountBatteriesTotal
  | AddOneBattery
  | InsertOneBattery
  | UpdateOneBattery
  | DeleteOne;
