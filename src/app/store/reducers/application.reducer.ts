import * as fromApplication from '../actions/application.action';

import { Locations } from './../../models/locations.m';

export interface ApplicationState {
  name: string;
  location: string;
  locations: Locations[];
  working: boolean;
}

const initialState: ApplicationState = {
  name: null,
  location: null,
  locations: null,
  working: false
};

export function reducer(
  state = initialState,
  action: fromApplication.ApplicationActions
): ApplicationState {
  switch (action.type) {
    case fromApplication.SET_APP_NAME:
      return {
        ...state,
        name: action.payload
      };

    case fromApplication.SET_LOCATION:
      return {
        ...state,
        location: action.payload
      };

    case fromApplication.SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload
      };

    case fromApplication.SET_SELECTED_LOCATION:
      return {
        ...state,
        location: action.payload
      };

    case fromApplication.START_WORKING:
      if (state.working === false) {
        return {
          ...state,
          working: true
        };
      } else if (state.working === true) {
        return state;
      } else {
        return state;
      }

    case fromApplication.FINISH_WORKING:
      if (state.working === true) {
        return {
          ...state,
          working: false
        };
      } else if (state.working === false) {
        return state;
      } else {
        return state;
      }

    default:
      return state;
  }
}

// selectors

export const getApplicationName = (state: ApplicationState) => state.name;
export const getApplicationLocation = (state: ApplicationState) =>
  state.location;
export const getApplicationLocations = (state: ApplicationState) =>
  state.locations;
export const getApplicationWorking = (state: ApplicationState) => state.working;
