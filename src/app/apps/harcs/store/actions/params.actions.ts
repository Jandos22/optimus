import { Action } from '@ngrx/store';

// interfaces
import { HarcsSearchParams } from '../../../../shared/interface/harcs.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Harcs] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: HarcsSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
