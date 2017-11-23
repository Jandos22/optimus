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
        location: null,
        query: null
    },
    users: null
};

export function reducer(state = initialState, action: people.Actions): PeopleState {
    switch (action.type) {

        case people.UPDATE_SEARCH_PARAMS:
        return {
            ...state,
            search: { ...state.search,
                      ...action.params }
        };

        case people.UPDATE_PEOPLE_LIST:
            return {
                ...state,
                users: action.payload
            };

        case people.NO_RESULTS:
            return {
                ...state,
                users: null
            };

        case people.CLEAR_STATE:
            return {
                ...state,
                search: null,
                users: null
            };

        default:
            return state;
    }
}

// Prepared Selectors
export const getSearchParams = (state: FeatureState) => state.people.search;
export const getSearchLocation = (state: FeatureState) => state.people.search.location;
export const getSearchQuery = (state: FeatureState) => state.people.search.query;
export const getPeopleList = (state: FeatureState) => state.people.users;
