import { Action } from '@ngrx/store';

// interfaces
import { PeopleParams } from '../../models/people-params.model';

// actions
export const UPDATE_PARAMS = '[People] Update Params';

// action creators

export class UpdateParams implements Action {
  readonly type = UPDATE_PARAMS;
  constructor(public params: PeopleParams) {}
}

export type ParamsActions = UpdateParams;
