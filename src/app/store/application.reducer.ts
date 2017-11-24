import * as application from './application.actions';
import { Locations } from '../shared/interfaces/locations.model';

export interface ApplicationState {
    name: string;
    location: string;
    locations: Locations;
    working: boolean;
}

const initialState: ApplicationState = {
    name: null,
    location: null,
    locations: null,
    working: false
};

export function reducer(state = initialState, action: application.Actions): ApplicationState {

    switch (action.type) {

        case application.SET_APP_NAME:
            return {
                ...state,
                name: action.payload
            };

        case application.SET_LOCATION:
            return {
                ...state,
                location: action.payload
            };

        case application.SET_LOCATIONS:
            return {
                ...state,
                locations: action.payload
            };

        case application.SET_SELECTED_LOCATION:
            return {
                ...state,
                location: action.payload
            };

        case application.START_WORKING:

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

        case application.FINISH_WORKING:

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

export const getApplicationName
    = (state: ApplicationState) => state.name;

export const getApplicationLocation
    = (state: ApplicationState) => state.location;

export const getApplicationLocations
    = (state: ApplicationState) => state.locations;

export const getApplicationWorking
    = (state: ApplicationState) => state.working;
