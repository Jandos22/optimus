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
    case fromSearch.UPDATE_SEARCH_QUERY:
      return {
        ...state,
        params: {
          ...state.params,
          query: action.query
        }
      };

    case fromSearch.UPDATE_SEARCH_LOCATION:
      return {
        ...state,
        params: {
          ...state.params,
          location: action.location
        }
      };

    case fromSearch.START_SEARCH_PEOPLE:
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

export const getSearch = (state: SearchState) => state;
export const getSearchParams = (state: SearchState) => state.params;
export const getSearchLocation = (state: SearchState) => state.params.location;
export const getSearchQuery = (state: SearchState) => state.params.query;
