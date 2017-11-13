import * as people from './people.actions';

export interface FeatureState {
    people: PeopleState;
}

export interface PeopleState {
    people: Array<any>;
}

const initialState: PeopleState = {
    people: null
};

export function reducer(state = initialState, action: people.Actions): PeopleState {
    switch (action.type) {

        case people.NAVIGATED_TO_PEOPLE:
            return state;

        default:
            return state;
    }
}
