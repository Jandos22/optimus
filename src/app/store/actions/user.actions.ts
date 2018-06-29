import { Action } from '@ngrx/store';

// interfaces
import { UserBootstrapStage } from '../../shared/interface/user.model';

// ACTIONS

// in reducer

export enum UserActionTypes {
  // bootstrapping actions
  START_USER_BOOTSTRAPPING = '[User] Started Bootstrapping User',
  FINISH_USER_BOOTSTRAPPING = '[User] Finished Bootstrapping User',
  UPDATE_BOOTSTRAPPING_STAGE = '[User] Update Bootstrapping Stage',
  // get/set actions
  GET_CURRENT_USER = '[User] Get Current User',
  SET_CURRENT_USER = '[User] Set Current User',
  SET_USER_NOT_REGISTERED = '[User] Set User Not Registered',
  SET_OPTIMUS_USER = '[User] Set Optimus User',
  // effects actions
  CHECK_CURRENT_USER = '[User] Check Current User',
  UPDATE_USER_LOCATIONS_OF_INTEREST = '[User] Update User Locations Of Interest'
}

export class StartUserBootstrapping implements Action {
  readonly type = UserActionTypes.START_USER_BOOTSTRAPPING;
}

export class FinishUserBootstrapping implements Action {
  readonly type = UserActionTypes.FINISH_USER_BOOTSTRAPPING;
}

export class UpdateBootstrappingStage implements Action {
  readonly type = UserActionTypes.UPDATE_BOOTSTRAPPING_STAGE;
  constructor(public stage: UserBootstrapStage) {}
}

export class GetCurrentUser implements Action {
  readonly type = UserActionTypes.GET_CURRENT_USER;
}

export class SetCurrentUser implements Action {
  readonly type = UserActionTypes.SET_CURRENT_USER;
  constructor(public payload: any) {}
}

export class CheckCurrentUser implements Action {
  readonly type = UserActionTypes.CHECK_CURRENT_USER;
  constructor(public payload: any) {}
}

export class SetUserNotRegistered implements Action {
  readonly type = UserActionTypes.SET_USER_NOT_REGISTERED;
  constructor(public payload: any) {}
}

export class SetOptimusUser implements Action {
  readonly type = UserActionTypes.SET_OPTIMUS_USER;
  constructor(public payload: any) {}
}

export class UpdateUserLocationsOfInterest implements Action {
  readonly type = UserActionTypes.UPDATE_USER_LOCATIONS_OF_INTEREST;
  constructor(public payload: number[]) {}
}

export type UserActionsUnion =
  | StartUserBootstrapping
  | FinishUserBootstrapping
  | UpdateBootstrappingStage
  | GetCurrentUser
  | SetCurrentUser
  | CheckCurrentUser
  | SetUserNotRegistered
  | SetOptimusUser
  | UpdateUserLocationsOfInterest;
