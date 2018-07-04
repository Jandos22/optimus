import { Action } from '@ngrx/store';

// interfaces
import { TimelineSearchParams } from './../../../../shared/interface/timeline.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Timeline] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: TimelineSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
