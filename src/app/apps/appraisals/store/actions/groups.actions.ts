import { Action } from '@ngrx/store';

import { AppraisalItem } from '../../../../shared/interface/appraisals.model';
import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';

export enum GroupsActionTypes {
  GROUP_APPRAISALS_BY_JOBS = '[Appraisals] Group Appraisals By Jobs',
  GROUP_APPRAISALS_BY_JOBS_SUCCESS = '[Appraisals] Group Appraisals By Jobs Success'
}

export class GroupAppraisalsByJobs implements Action {
  readonly type = GroupsActionTypes.GROUP_APPRAISALS_BY_JOBS;
  constructor(public appraisals: AppraisalItem[]) {}
}

export class GroupAppraisalsByJobsSuccess implements Action {
  readonly type = GroupsActionTypes.GROUP_APPRAISALS_BY_JOBS_SUCCESS;
  constructor(public jobs: AppraisalGroupItem[]) {}
}

export type GroupsActionsUnion =
  | GroupAppraisalsByJobs
  | GroupAppraisalsByJobsSuccess;
