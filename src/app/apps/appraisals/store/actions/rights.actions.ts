import { Action } from '@ngrx/store';
import { AppraisalRights } from '..';

export enum AppraisalsRightsActionTypes {
  CHECK_RIGHTS = '[Appraisals] Chech Rights',
  CHECK_RIGHTS_SUCCESS = '[Appraisals] Chech Rights Success'
}

export class CheckRights implements Action {
  readonly type = AppraisalsRightsActionTypes.CHECK_RIGHTS;
  constructor(public myPositionId: number) {}
}

export class CheckRightsSuccess implements Action {
  readonly type = AppraisalsRightsActionTypes.CHECK_RIGHTS_SUCCESS;
  // later change any to rights interface
  constructor(public rights: AppraisalRights) {}
}

export type AppraisalsRightsActionsUnion = CheckRights | CheckRightsSuccess;
