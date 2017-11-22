import * as fromRoot from '../../../store/app.reducers';
import * as people from './people.actions';
import { PeopleSearch } from '../model/people-search.model';

export interface PeopleFeatureState extends fromRoot.State {
    people: PeopleState;
}

export interface PeopleState {
    search: PeopleSearch;
    users: Array<any>;
}

const initialState: PeopleState = {
    search: {
        location: null,
        query: null
    },
    users: null
};

export function people_reducer(state = initialState, action: people.Actions): PeopleState {
    switch (action.type) {

        case people.PEOPLE_UPDATE_SEARCH_LOCATION:
            return {
                ...state,
                search: { ...state.search,
                          location: action.payload }
            };

        case people.PEOPLE_UPDATE_SEARCH_QUERY:
            return {
                ...state,
                search: { ...state.search,
                          query: action.payload }
            };

        case people.PEOPLE_UPDATE_PEOPLE_LIST:
            return {
                ...state,
                users: action.payload
            };

        case people.PEOPLE_NO_RESULTS:
            return {
                ...state,
                users: null
            };

        case people.PEOPLE_CLEAR_STATE:
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
export const getPeopleSearchParams = (state: PeopleFeatureState) => state.people.search;
export const getPeopleSearchLocation = (state: PeopleFeatureState) => state.people.search.location;
export const getPeopleSearchQuery = (state: PeopleFeatureState) => state.people.search.query;
export const getPeopleList = (state: PeopleFeatureState) => state.people.users;
