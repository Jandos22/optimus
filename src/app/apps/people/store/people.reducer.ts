import * as fromRoot from '../../../store/app.reducers';
import * as people from './people.actions';
import { PeopleSearch } from '../model/people-search.model';

export interface FeatureState extends fromRoot.State {
    people: PeopleState;
}

export interface PeopleState {
    search: PeopleSearch;
    users: Array<any>;
}

const initialState: PeopleState = {
    search: {
        location: undefined,
        query: undefined
    },
    users: null
};

export function reducer(state = initialState, action: people.Actions): PeopleState {
    switch (action.type) {

        case people.NAVIGATED_TO_PEOPLE:
            return state;

        case people.UPDATE_SEARCH_LOCATION:
            return {
                ...state,
                search: { ...state.search,
                          location: action.payload }
            };

        case people.CLEAR_STATE:
            return {
                ...state,
                search: undefined,
                users: undefined
            };

        default:
            return state;
    }
}

// Prepared Selectors
export const getSearchParams = (state: FeatureState) => state.people.search;
