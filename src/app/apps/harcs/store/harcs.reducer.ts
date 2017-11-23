import * as fromRoot from '../../../store/app.reducers';
import * as harcs from '../store/harcs.actions';
import { HarcsSearch } from '../model/harcs-search.model';

export interface FeatureState extends fromRoot.State {
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

export function reducer(state = initialState, action: harcs.Actions): HarcsState {
    switch (action.type) {
        case harcs.UPDATE_SEARCH_PARAMS:
            return {
                ...state,
                search: {
                    ...state.search,
                    ...action.params
                }
            };

        case harcs.UPDATE_HARCS_LIST:
            return {
                ...state,
                harcs: action.payload
            };

        case harcs.NO_RESULTS:
            return {
                ...state,
                harcs: null
            };

        case harcs.CLEAR_STATE:
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
export const getSearchParams = (state: FeatureState) => state.harcs.search;
export const getSearchLocation = (state: FeatureState) => state.harcs.search.location;
export const getSearchQuery = (state: FeatureState) => state.harcs.search.query;
export const getHarcsList = (state: FeatureState) => state.harcs.harcs;
