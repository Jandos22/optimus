import { UserActionTypes, UserActionsUnion } from '../actions/user.actions';

// interfaces
import { UserState } from '../../shared/interface/user.model';

const initialState: UserState = {
  bootstrap: {
    bootstrapping: null,
    currentStage: null
  },
  sharepoint: {
    username: null,
    email: null,
    initials: null,
    spId: null,
    isRegistered: null
  },
  optimus: null
};

export function reducer(
  state = initialState,
  action: UserActionsUnion
): UserState {
  switch (action.type) {
    case UserActionTypes.START_USER_BOOTSTRAPPING:
      return {
        ...state,
        bootstrap: { ...state.bootstrap, bootstrapping: true }
      };

    case UserActionTypes.FINISH_USER_BOOTSTRAPPING:
      return {
        ...state,
        bootstrap: { ...state.bootstrap, bootstrapping: false }
      };

    case UserActionTypes.UPDATE_BOOTSTRAPPING_STAGE:
      return {
        ...state,
        bootstrap: { ...state.bootstrap, currentStage: action.stage }
      };

    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        sharepoint: {
          ...state.sharepoint,
          ...action.payload
        }
      };

    case UserActionTypes.SET_OPTIMUS_USER:
      return {
        ...state,
        optimus: {
          ...state.optimus,
          ...action.payload
        }
      };

    case UserActionTypes.UPDATE_USER_REGISTERED:
      return {
        ...state,
        sharepoint: {
          ...state.sharepoint,
          isRegistered: action.registered
        }
      };

    case UserActionTypes.UPDATE_USER_LOCATIONS_OF_INTEREST:
      return {
        ...state,
        optimus: {
          ...state.optimus,
          LocationsOfInterestId: action.payload
        }
      };

    default:
      return state;
  }
}

// state selectors
export const getUser = (state: UserState) => state;

// from user
export const getUserBoostrap = (state: UserState) => state.bootstrap;
export const getUserSharepoint = (state: UserState) => state.sharepoint;
export const getUserOptimus = (state: UserState) => state.optimus;

// from optimus
export const getUserId = (state: UserState) => state.optimus.Id;

// from sharepoint
export const getUsername = (state: UserState) => state.sharepoint.username;
export const getEmail = (state: UserState) => state.sharepoint.email;
export const getIsRegistered = (state: UserState) =>
  state.sharepoint.isRegistered;
export const getInitials = (state: UserState) => state.sharepoint.initials;
// export const getPhoto = (state: UserState) => state.optimus.photo;
// export const getPhotoUrl = (state: UserState) => state.optimus.photoUrl;
