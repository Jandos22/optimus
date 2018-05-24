import { Action } from '@ngrx/store';
import {
  Exemption,
  ExemptionsGrouped
} from './../../../../shared/interface/exemptions.model';

export enum ExemptionsActionTypes {
  GET_EXEMPTIONS = '[Exemptions] Get Exemptions',
  GROUP_EXEMPTIONS = '[Exemptions] Group Exemptions',
  UPDATE_EXEMPTIONS_LIST = '[Exemptions] Update Exemptions List',
  UPDATE_GROUPED_EXEMPTIONS_LIST = '[Exemptions] Update Grouped Exemptions List'
}

export class GetExemptions implements Action {
  readonly type = ExemptionsActionTypes.GET_EXEMPTIONS;
  constructor(public payload: any) {}
}

export class GroupExemptions implements Action {
  readonly type = ExemptionsActionTypes.GROUP_EXEMPTIONS;
  constructor(public payload: any[]) {}
}

export class UpdateExemptionsList implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_EXEMPTIONS_LIST;
  constructor(public payload: Exemption[]) {}
}

export class UpdateGroupedExemptionsList implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_GROUPED_EXEMPTIONS_LIST;
  constructor(public payload: ExemptionsGrouped[]) {}
}

export type ExemptionsActionsUnion =
  | GetExemptions
  | GroupExemptions
  | UpdateExemptionsList
  | UpdateGroupedExemptionsList;
