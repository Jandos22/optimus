import { Action } from '@ngrx/store';

import { KaizenProjectType } from '../../../../shared/interface/kaizen.model';

export enum ProjectTypesActionTypes {
  FETCH_PROJECT_TYPES = '[Kaizen Projects] Fetch Project Types',
  FETCH_PROJECT_TYPES_SUCCESS = '[Kaizen Projects] Fetch Project Types Success',
  FILTERING_APPLICABLE_PROJECT_TYPES_SUCCESS = '[Kaizen Projects] Filtering Applicable Project Types Success'
}

export class FetchProjectTypes implements Action {
  readonly type = ProjectTypesActionTypes.FETCH_PROJECT_TYPES;
}

export class FetchProjectTypesSuccess implements Action {
  readonly type = ProjectTypesActionTypes.FETCH_PROJECT_TYPES_SUCCESS;
  constructor(public projectTypes: KaizenProjectType[]) {}
}

export class FilteringApplicableProjectTypesSuccess implements Action {
  readonly type =
    ProjectTypesActionTypes.FILTERING_APPLICABLE_PROJECT_TYPES_SUCCESS;
  constructor(public applicableProjectTypes: KaizenProjectType[]) {}
}

export type ProjectTypesActionsUnion =
  | FetchProjectTypes
  | FetchProjectTypesSuccess
  | FilteringApplicableProjectTypesSuccess;
