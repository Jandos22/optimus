import { Action } from '@ngrx/store';

import { KaizenProjectItem } from '../../../../shared/interface/kaizen.model';

export enum ProjectsActionTypes {
  SEARCH_PROJECTS_START = '[Kaizen Projects] Search Projects Start',
  SEARCH_PROJECTS_SUCCESS = '[Kaizen Projects] Search Projects Success',
  SEARCH_PROJECTS_NO_RESULTS = '[Kaizen Projects] Search Projects No Results',
  COUNT_PROJECTS_TOTAL = '[Kaizen Projects] Count Total (since next url is present)',
  ADD_ONE_PROJECT = '[Kaizen Projects] Add One Project',
  INSERT_ONE_PROJECT = '[Kaizen Projects] Insert One Project (in beginning)',
  UPDATE_ONE_PROJECT = '[Kaizen Projects] Update One Project'
}

export class SearchProjectsStart implements Action {
  readonly type = ProjectsActionTypes.SEARCH_PROJECTS_START;
  constructor(public url: string) {}
}

export class SearchProjectsSuccess implements Action {
  readonly type = ProjectsActionTypes.SEARCH_PROJECTS_SUCCESS;
  constructor(public projects: KaizenProjectItem[]) {}
}

export class SearchProjectsNoResults implements Action {
  readonly type = ProjectsActionTypes.SEARCH_PROJECTS_NO_RESULTS;
}

export class CountProjectsTotal implements Action {
  readonly type = ProjectsActionTypes.COUNT_PROJECTS_TOTAL;
}

export class AddOneProject implements Action {
  readonly type = ProjectsActionTypes.ADD_ONE_PROJECT;
  constructor(public project: KaizenProjectItem) {}
}

export class InsertOneProject implements Action {
  readonly type = ProjectsActionTypes.INSERT_ONE_PROJECT;
  constructor(public project: KaizenProjectItem) {}
}

export class UpdateOneProject implements Action {
  readonly type = ProjectsActionTypes.UPDATE_ONE_PROJECT;
  constructor(public id: number, public changes: KaizenProjectItem) {}
}

export type ProjectsActionsUnion =
  | SearchProjectsStart
  | SearchProjectsSuccess
  | SearchProjectsNoResults
  | CountProjectsTotal
  | AddOneProject
  | InsertOneProject
  | UpdateOneProject;
