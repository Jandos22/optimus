export interface UserState {
  sharepoint: SharepointUser;
  optimus: OptimusUser;
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
