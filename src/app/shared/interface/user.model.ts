export interface UserState {
  sharepoint: {
    username: string;
    email: string;
    initials: string;
    spId: number;
  };
  optimus: OptimusUser;
}

export interface OptimusUser {
  isRegistered: boolean;
  name: string;
  surname: string;
  photo: string;
  locationAssigned: number;
  locationsOfInterest: number[];
}
