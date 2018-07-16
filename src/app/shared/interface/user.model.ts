import { PeopleItem } from './people.model';

export interface UserState {
  bootstrap: BootstrapUser;
  sharepoint: SharepointUser;
  optimus: PeopleItem;
}

export type UserBootstrapStage =
  | 'Retrieving Username ...'
  | 'Logged in as: '
  | 'Looking for Optimus account ...'
  | 'Optimus account found ...';

export interface BootstrapUser {
  bootstrapping: boolean;
  currentStage: UserBootstrapStage;
}

export interface SharepointUser {
  username: string;
  email: string;
  initials: string;
  spId: number;
  isRegistered: boolean;
}

export interface CurrentUser {
  Email: string;
  Id: number;
  IsSiteAdmin: boolean;
  LoginName: string;
  PrincipalType: number;
  Title: string;
}
