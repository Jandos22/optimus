import * as fromUser from '../actions/user.actions';

// interfaces
import { UserState } from '../../shared/interface/user.model';

const initialState: UserState = {
  sharepoint: {
    username: null,
    email: null,
    initials: null,
    spId: null
  },
  optimus: {
    Id: null,
    isRegistered: null,
    name: null,
    surname: null,
    photo: null,
    photoUrl: null,
    locationAssigned: null,
    locationsOfInterest: []
  }
};

export function reducer(
  state = initialState,
  action: fromUser.UserActions
): UserState {
  switch (action.type) {
    case fromUser.SET_CURRENT_USER:
      return {
        ...state,
        sharepoint: {
          ...state.sharepoint,
          ...action.payload
        }
      };

    case fromUser.SET_OPTIMUS_USER:
      return {
        ...state,
        optimus: {
          ...state.optimus,
          ...action.payload
        }
      };

    case fromUser.SET_USER_NOT_REGISTERED:
      return {
        ...state,
        optimus: {
          ...state.optimus,
          isRegistered: action.payload
        }
      };

    case fromUser.UPDATE_USER_LOCATIONS_OF_INTEREST:
      return {
        ...state,
        optimus: {
          ...state.optimus,
          locationsOfInterest: action.payload
        }
      };

    default:
      return state;
  }
}

// state selectors
export const getUser = (state: UserState) => state;
export const getUsername = (state: UserState) => state.sharepoint.username;
export const getEmail = (state: UserState) => state.sharepoint.email;
export const getUserId = (state: UserState) => state.optimus.Id;
export const getIsRegistered = (state: UserState) => state.optimus.isRegistered;
export const getInitials = (state: UserState) => state.sharepoint.initials;
export const getPhoto = (state: UserState) => state.optimus.photo;
export const getPhotoUrl = (state: UserState) => state.optimus.photoUrl;
