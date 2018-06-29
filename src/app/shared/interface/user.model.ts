export interface UserState {
  bootstrap: BootstrapUser;
  sharepoint: SharepointUser;
  optimus: OptimusUser;
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
}

export interface OptimusUser {
  Id: number;
  isRegistered: boolean;
  name: string;
  surname: string;
  photo: boolean;
  photoUrl: string;
  locationAssigned: number;
  locationsOfInterest: number[];
}
