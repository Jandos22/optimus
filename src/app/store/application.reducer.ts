import * as application from './application.actions';
import { Locations } from '../shared/interfaces/locations.model';

export interface ApplicationState {
    name: string;
    location: string;
    locations: Locations;
}

const initialState: ApplicationState = {
    name: null,
    location: null,
    locations: null
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
