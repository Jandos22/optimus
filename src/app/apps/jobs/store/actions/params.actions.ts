import { Action } from '@ngrx/store';

// interfaces
import { JobsSearchParams } from '../../../../shared/interface/jobs.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Jobs] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: JobsSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
