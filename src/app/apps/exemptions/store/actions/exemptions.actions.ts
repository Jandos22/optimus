import { Action } from '@ngrx/store';

export enum ExemptionsActionTypes {
  GET_EXEMPTIONS = '[Exemptions] Get Exemptions',
  UPDATE_LIST = '[Exemptions] Update List'
}

export class GetExemptions implements Action {
  readonly type = ExemptionsActionTypes.GET_EXEMPTIONS;
  constructor(public payload: any) {}
}

export class UpdateList implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_LIST;
  constructor(public payload: any) {}
}

export type ExemptionsActionsUnion = GetExemptions | UpdateList;
