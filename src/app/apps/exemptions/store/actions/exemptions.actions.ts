import { Action } from '@ngrx/store';
import {
  ExemptionsRaw,
  ExemptionsGrouped
} from './../../../../shared/interface/exemptions.model';

export enum ExemptionsActionTypes {
  GET_EXEMPTIONS = '[Exemptions] Get Exemptions',
  MAP_EXEMPTIONS = '[Exemptions] Map Exemptions',
  UPDATE_EXEMPTIONS_LIST = '[Exemptions] Update Exemptions List'
}

export class GetExemptions implements Action {
  readonly type = ExemptionsActionTypes.GET_EXEMPTIONS;
  constructor(public payload: any) {}
}

export class MapExemptions implements Action {
  readonly type = ExemptionsActionTypes.MAP_EXEMPTIONS;
  constructor(public payload: any[]) {}
}

export class UpdateExemptionsList implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_EXEMPTIONS_LIST;
  constructor(public payload: ExemptionsGrouped[]) {}
}

export type ExemptionsActionsUnion =
  | GetExemptions
  | MapExemptions
  | UpdateExemptionsList;
