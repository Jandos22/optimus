import * as fromSearch from '../actions/search.action';

export interface SearchState {
  params: {
    query: string;
    location: string;
  };
  searching: boolean;
  completed: boolean;
}

export const initialState: SearchState = {
  params: {
    query: null,
    location: null
  },
  searching: false,
  completed: false
};

export function reducer(
  state = initialState,
  action: fromSearch.PeopleSearchActions
): SearchState {
  switch (action.type) {
    case fromSearch.UPDATE_SEARCH_PARAMS:
      return {
        ...state,
        params: {
          ...state.params,
          query: action.payload.query,
          location: action.payload.location
        }
      };

    case fromSearch.START_PEOPLE_SEARCH:
      return {
        ...state,
        searching: true,
        completed: false
      };

    case fromSearch.FINISH_PEOPLE_SEARCH:
      return {
        ...state,
        searching: false,
        completed: true
      };

    case fromSearch.CLEAR_SEARCH_STATE:
      return {
        ...state,
        ...initialState
      };

    default:
      return state;
  }
}

export const getSearchParams = (state: SearchState) => state;
export const getSearchLocation = (state: SearchState) => state.params.location;
export const getSearchQuery = (state: SearchState) => state.params.query;
