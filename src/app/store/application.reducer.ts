import * as application from './application.actions';

export interface ApplicationState {
    name: string;
    location: string;
}

const initialState: ApplicationState = {
    name: null,
    location: null
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

        default:
            return state;

    }

}

export const getApplicationName
    = (state: ApplicationState) => state.name;

export const getApplicationLocation
    = (state: ApplicationState) => state.location;
