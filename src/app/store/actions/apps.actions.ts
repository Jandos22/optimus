import { Action } from '@ngrx/store';

// interfaces
import { AppItem } from './../../shared/interface/applications.model';

export enum AppsActionTypes {
  GET_ALL_APPS = '[Apps] Get All Applications',
  GET_ALL_APPS_SUCCESS = '[Apps] Get All Applications Success',
  SET_APP_NAME = '[Application] Set App Name'
}

export class GetAllApps implements Action {
  readonly type = AppsActionTypes.GET_ALL_APPS;
}

export class GetAllAppsSuccess implements Action {
  readonly type = AppsActionTypes.GET_ALL_APPS_SUCCESS;
  constructor(public apps: AppItem[]) {}
}

export class SetAppName implements Action {
  readonly type = AppsActionTypes.SET_APP_NAME;
  constructor(public payload: string) {}
}

export type AppsActionsUnion = GetAllApps | GetAllAppsSuccess | SetAppName;
