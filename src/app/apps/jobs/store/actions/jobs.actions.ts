import { Action } from '@ngrx/store';

import { JobItem } from '../../../../shared/interface/jobs.model';

export enum JobsActionTypes {
  SEARCH_JOBS_START = '[Jobs] Search Jobs Start',
  SEARCH_JOBS_SUCCESS = '[Jobs] Search Jobs Success',
  SEARCH_JOBS_NO_RESULTS = '[Jobs] Search Jobs No Results',
  COUNT_JOBS_TOTAL = '[Jobs] Count Total (since next url is present)',
  ADD_ONE_JOB = '[Jobs] Add One Job',
  INSERT_ONE_JOB = '[Jobs] Insert One Job (in beginning)',
  UPDATE_ONE_JOB = '[Jobs] Update One Job'
}

export class SearchJobsStart implements Action {
  readonly type = JobsActionTypes.SEARCH_JOBS_START;
  constructor(public url: string) {}
}

export class SearchJobsSuccess implements Action {
  readonly type = JobsActionTypes.SEARCH_JOBS_SUCCESS;
  constructor(public jobs: JobItem[]) {}
}

export class SearchJobsNoResults implements Action {
  readonly type = JobsActionTypes.SEARCH_JOBS_NO_RESULTS;
}

export class CountJobsTotal implements Action {
  readonly type = JobsActionTypes.COUNT_JOBS_TOTAL;
}

export class AddOneJob implements Action {
  readonly type = JobsActionTypes.ADD_ONE_JOB;
  constructor(public job: JobItem) {}
}

export class InsertOneJob implements Action {
  readonly type = JobsActionTypes.INSERT_ONE_JOB;
  constructor(public job: JobItem) {}
}

export class UpdateOneJob implements Action {
  readonly type = JobsActionTypes.UPDATE_ONE_JOB;
  constructor(public id: number, public changes: JobItem) {}
}

export type JobsActionsUnion =
  | SearchJobsStart
  | SearchJobsSuccess
  | SearchJobsNoResults
  | CountJobsTotal
  | AddOneJob
  | InsertOneJob
  | UpdateOneJob;
