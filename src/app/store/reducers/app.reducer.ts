import * as a_in_app from '../actions/app.actions';

import { Locations } from './../../models/locations.m';

export interface AppState {
  name: string;
}

const initialState: AppState = {
  name: null
};

export function reducer(
  state = initialState,
  action: a_in_app.ApplicationActions
): AppState {
  switch (action.type) {
    case a_in_app.SET_APP_NAME:
      return {
        ...state,
        name: action.payload
      };

    default:
      return state;
  }
}

// selectors

export const getAppName = (state: AppState) => state.name;
