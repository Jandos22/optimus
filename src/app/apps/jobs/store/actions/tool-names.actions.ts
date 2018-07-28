import { Action } from '@ngrx/store';

import { ToolItem } from '../../../../shared/interface/tools.model';

export enum ToolNamesActionTypes {
  FETCH_TOOL_NAMES = '[Jobs] Fetch Tools Names',
  FETCH_TOOL_NAMES_SUCCESS = '[Jobs] Fetch Tool Names Success'
}

export class FetchToolNames implements Action {
  readonly type = ToolNamesActionTypes.FETCH_TOOL_NAMES;
}

export class FetchToolNamesSuccess implements Action {
  readonly type = ToolNamesActionTypes.FETCH_TOOL_NAMES_SUCCESS;
  constructor(public toolsNames: ToolItem[]) {}
}

export type ToolNamesActionsUnion = FetchToolNames | FetchToolNamesSuccess;
