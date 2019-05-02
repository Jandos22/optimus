import { Action } from '@ngrx/store';

// interfaces
import { BatteriesSearchParams } from '../../../../shared/interface/batteries.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Batteries] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: BatteriesSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
