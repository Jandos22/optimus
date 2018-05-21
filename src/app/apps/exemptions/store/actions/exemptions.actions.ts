import { Action } from '@ngrx/store';

export enum ExemptionsActionTypes {
  GET_EXEMPTIONS = '[Exemptions] Get Exemptions',
  UPDATE_EXEMPTIONS_LIST = '[Exemptions] Update Exemptions List'
}

export class GetExemptions implements Action {
  readonly type = ExemptionsActionTypes.GET_EXEMPTIONS;
  constructor(public payload: any) {}
}

export class UpdateExemptionsList implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_EXEMPTIONS_LIST;
  constructor(public payload: any) {}
}

export type ExemptionsActionsUnion = GetExemptions | UpdateExemptionsList;
