import { Action } from '@ngrx/store';

import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

export enum ExemptionsActionTypes {
  SEARCH_EXEMPTIONS_START = '[Exemptions] Search Exemptions Start',
  SEARCH_EXEMPTIONS_SUCCESS = '[Exemptions] Search Exemptions Success',
  SEARCH_EXEMPTIONS_NO_RESULTS = '[Exemptions] Search Exemptions No Results',
  COUNT_EXEMPTIONS_TOTAL = '[Exemptions] Count Total (since next url is present)',
  ADD_ONE_EXEMPTION = '[Exemptions] Add One Exemption',
  INSERT_ONE_EXEMPTION = '[Exemptions] Insert One Exemption (in beginning)',
  UPDATE_ONE_EXEMPTION = '[Exemptions] Update One Exemption'
}

export class SearchExemptionsStart implements Action {
  readonly type = ExemptionsActionTypes.SEARCH_EXEMPTIONS_START;
  constructor(public url: string) {}
}

export class SearchExemptionsSuccess implements Action {
  readonly type = ExemptionsActionTypes.SEARCH_EXEMPTIONS_SUCCESS;
  constructor(public exemptions: ExemptionItem[]) {}
}

export class SearchExemptionsNoResults implements Action {
  readonly type = ExemptionsActionTypes.SEARCH_EXEMPTIONS_NO_RESULTS;
}

export class CountExemptionsTotal implements Action {
  readonly type = ExemptionsActionTypes.COUNT_EXEMPTIONS_TOTAL;
}

export class AddOneExemption implements Action {
  readonly type = ExemptionsActionTypes.ADD_ONE_EXEMPTION;
  constructor(public exemption: ExemptionItem) {}
}

export class InsertOneExemption implements Action {
  readonly type = ExemptionsActionTypes.INSERT_ONE_EXEMPTION;
  constructor(public exemption: ExemptionItem) {}
}

export class UpdateOneExemption implements Action {
  readonly type = ExemptionsActionTypes.UPDATE_ONE_EXEMPTION;
  constructor(public id: number, public changes: ExemptionItem) {}
}

export type ExemptionsActionsUnion =
  | SearchExemptionsStart
  | SearchExemptionsSuccess
  | SearchExemptionsNoResults
  | CountExemptionsTotal
  | AddOneExemption
  | InsertOneExemption
  | UpdateOneExemption;
