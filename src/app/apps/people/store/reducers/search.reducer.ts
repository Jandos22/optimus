import * as fromSearch from '../actions/search.action';

export interface SearchState {
  params: {
    query: string;
    location: string;
  };
  uri: {
    __prev: string;
    __curr: string;
    __next: string;
  };
}

export const initialState: SearchState = {
  params: {
    query: null,
    location: null
  },
  uri: {
    __prev: '',
    __curr: '',
    __next: ''
  }
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
        ...state
      };

    case fromSearch.UPDATE_SEARCH_URI_CURRENT:
      return {
        ...state,
        uri: {
          ...state.uri,
          __curr: action.uri
        }
      };

    case fromSearch.UPDATE_SEARCH_URI_NEXT:
      return {
        ...state,
        uri: {
          ...state.uri,
          __next: action.uri
        }
      };

    default:
      return state;
  }
}

export const getSearch = (state: SearchState) => state;
export const getSearchParams = (state: SearchState) => state.params;
export const getSearchLocation = (state: SearchState) => state.params.location;
export const getSearchQuery = (state: SearchState) => state.params.query;
export const getSearchUriCurrent = (state: SearchState) => state.uri.__curr;
