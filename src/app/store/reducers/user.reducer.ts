import * as fromUser from '../actions/user.action';

export interface UserState {
  username: string;
  email: string;
  initials: string;
  spId: number;
  isRegistered: boolean;
  name: string;
  surname: string;
  photo: string;
  location: string;
}

const initialState: UserState = {
  username: null,
  email: null,
  initials: null,
  spId: null,
  isRegistered: null,
  name: null,
  surname: null,
  photo: null,
  location: null
};

export function reducer(
  state = initialState,
  action: fromUser.UserActions
): UserState {
  switch (action.type) {
    case fromUser.SET_CURRENT_USER:
      return {
        ...state,
        ...action.payload
      };

    case fromUser.SET_OPTIMUS_USER:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// state selectors
export const getIsRegistered = (state: UserState) => state.isRegistered;
export const getInitials = (state: UserState) => state.initials;
export const getPhoto = (state: UserState) => state.photo;
