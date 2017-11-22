import * as fromRoot from '../../../store/app.reducers';
import * as harcs from '../store/harcs.actions';
import { HarcsSearch } from '../model/harcs-search.model';

export interface HarcsFeatureState extends fromRoot.State {
    harcs: HarcsState;
}

export interface HarcsState {
    search: HarcsSearch;
    harcs: Array<any>;
}

const initialState: HarcsState = {
    search: {
        location: null,
        query: null
    },
    harcs: null
};

export function harcs_reducer(state = initialState, action: harcs.Actions): HarcsState {
    switch (action.type) {
        case harcs.HARCS_UPDATE_SEARCH_LOCATION:
            return {
                ...state,
                search: { ...state.search,
                        location: action.payload }
            };

        case harcs.HARCS_UPDATE_SEARCH_QUERY:
            return {
                ...state,
                search: { ...state.search,
                          query: action.payload }
            };

        case harcs.HARCS_UPDATE_HARCS_LIST:
            return {
                ...state,
                harcs: action.payload
            };

        case harcs.HARCS_NO_RESULTS:
            return {
                ...state,
                harcs: null
            };

        case harcs.HARCS_CLEAR_STATE:
            return {
                ...state,
                search: undefined,
                harcs: undefined
            };

        default:
            return state;
    }
}

// Prepared Selectors
export const getHarcsSearchParams = (state: HarcsFeatureState) => state.harcs.search;
export const getHarcsSearchLocation = (state: HarcsFeatureState) => state.harcs.search.location;
export const getHarcsSearchQuery = (state: HarcsFeatureState) => state.harcs.search.query;
export const getHarcsList = (state: HarcsFeatureState) => state.harcs.harcs;
