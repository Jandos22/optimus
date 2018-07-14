import { Action } from '@ngrx/store';

// interfaces
import { KaizenSearchParams } from '../../../../shared/interface/kaizen.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Kaizen] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: KaizenSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
