import { Action } from '@ngrx/store';

// interfaces
import { OrdersSearchParams } from '../../../../shared/interface/orders.model';

// actions
export enum ParamsActionTypes {
  UPDATE_PARAMS = '[Orders] Update Params'
}

// action creators
export class UpdateParams implements Action {
  readonly type = ParamsActionTypes.UPDATE_PARAMS;
  constructor(public params: OrdersSearchParams) {}
}

export type ParamsActionsUnion = UpdateParams;
