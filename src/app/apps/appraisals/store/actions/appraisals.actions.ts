import { Action } from '@ngrx/store';

import { AppraisalItem } from '../../../../shared/interface/appraisals.model';

export enum AppraisalsActionTypes {
  SEARCH_APPRAISALS_START = '[Appraisals] Search Appraisals Start',
  SEARCH_APPRAISALS_SUCCESS = '[Appraisals] Search Appraisals Success',
  SEARCH_APPRAISALS_NO_RESULTS = '[Appraisals] Search Appraisals No Results',
  COUNT_APPRAISALS_TOTAL = '[Appraisals] Count Total (since next url is present)',
  ADD_ONE_APPRAISAL = '[Appraisals] Add One Appraisal',
  INSERT_ONE_APPRAISAL = '[Appraisals] Insert One Appraisal (in beginning)',
  UPDATE_ONE_APPRAISAL = '[Appraisals] Update One Appraisal',
  DELETE_ONE_APPRAISAL = '[Appraisals] Delete One Appraisal'
}

export class SearchAppraisalsStart implements Action {
  readonly type = AppraisalsActionTypes.SEARCH_APPRAISALS_START;
  constructor(public url: string) {}
}

export class SearchAppraisalsSuccess implements Action {
  readonly type = AppraisalsActionTypes.SEARCH_APPRAISALS_SUCCESS;
  constructor(public appraisals: AppraisalItem[]) {}
}

export class SearchAppraisalsNoResults implements Action {
  readonly type = AppraisalsActionTypes.SEARCH_APPRAISALS_NO_RESULTS;
}

export class CountAppraisalsTotal implements Action {
  readonly type = AppraisalsActionTypes.COUNT_APPRAISALS_TOTAL;
}

export class AddOneAppraisal implements Action {
  readonly type = AppraisalsActionTypes.ADD_ONE_APPRAISAL;
  constructor(public appraisal: AppraisalItem) {}
}

export class InsertOneAppraisal implements Action {
  readonly type = AppraisalsActionTypes.INSERT_ONE_APPRAISAL;
  constructor(public appraisal: AppraisalItem) {}
}

export class UpdateOneAppraisal implements Action {
  readonly type = AppraisalsActionTypes.UPDATE_ONE_APPRAISAL;
  constructor(public id: number, public changes: AppraisalItem) {}
}

export class DeleteOneAppraisal implements Action {
  readonly type = AppraisalsActionTypes.DELETE_ONE_APPRAISAL;
  constructor(public id: number) {}
}

export type AppraisalsActionsUnion =
  | SearchAppraisalsStart
  | SearchAppraisalsSuccess
  | SearchAppraisalsNoResults
  | CountAppraisalsTotal
  | AddOneAppraisal
  | InsertOneAppraisal
  | UpdateOneAppraisal
  | DeleteOneAppraisal;
