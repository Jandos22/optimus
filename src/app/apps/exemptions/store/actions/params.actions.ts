import { Action } from '@ngrx/store';

// interfaces
import { ExemptionsSearchParams } from '../../../../shared/interface/exemptions.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Exemptions] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: ExemptionsSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
