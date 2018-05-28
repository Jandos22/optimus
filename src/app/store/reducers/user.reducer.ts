import { UserState } from './../../ngrx-state-models/user-state.model';
import * as fromUser from '../actions/user.actions';

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

    case fromUser.SET_USER_NOT_REGISTERED:
      return {
        ...state,
        isRegistered: action.payload
      };

    default:
      return state;
  }
}

// state selectors
export const getUser = (state: UserState) => state;
export const getUsername = (state: UserState) => state.username;
export const getEmail = (state: UserState) => state.email;
export const getIsRegistered = (state: UserState) => state.isRegistered;
export const getInitials = (state: UserState) => state.initials;
export const getPhoto = (state: UserState) => state.photo;
