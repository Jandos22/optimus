import { Action } from '@ngrx/store';

// interfaces
import { AppraisalsSearchParams } from '../../../../shared/interface/appraisals.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Appraisals] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: AppraisalsSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
