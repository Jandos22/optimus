import { Action } from '@ngrx/store';

// interfaces
import { UserSearchParams } from '../../../../shared/interface/people.model';

// actions
export const UPDATE_PARAMS = '[People] Update Params';

// action creators

export class UpdateParams implements Action {
  readonly type = UPDATE_PARAMS;
  constructor(public params: UserSearchParams) {}
}

export type ParamsActions = UpdateParams;
