import * as fromPagination from '../actions/pagination.action';

import { WirelinePath, ApiPath } from './../../../../constants/index';

export interface PaginationState {
  indexes: {
    previous: number;
    current: number;
    next: number;
  };
  links: string[];
}

export const initialState: PaginationState = {
  indexes: {
    previous: null,
    current: null,
    next: null
  },
  links: []
};

export function reducer(
  state = initialState,
  action: fromPagination.PaginationActions
): PaginationState {
  switch (action.type) {
    case fromPagination.RESET_PAGINATION:
      return {
        ...state,
        ...initialState
      };

    case fromPagination.START_NEW_PAGE:
      console.log(action.url);
      console.log(checkUrl(action.url));
      return {
        ...state,
        indexes: { previous: null, current: 0, next: null },
        links: [checkUrl(action.url)]
      };

    case fromPagination.ADD_NEXT_LINK:
      return {
        ...state,
        indexes: { ...state.indexes, next: state.indexes.current + 1 },
        links: [...state.links, checkUrl(action.url)]
      };

    case fromPagination.NO_NEXT_LINK:
      return {
        ...state,
        indexes: { ...state.indexes, next: null }
      };

    // run when NEXT button is clicked
    case fromPagination.ON_NEXT:
      return {
        ...state,
        indexes: {
          previous: state.indexes.current,
          current: state.indexes.next,
          next: null
        }
      };

    // run when BACK button is clicked
    case fromPagination.ON_BACK:
      return {
        ...state,
        indexes: {
          previous: checkIndexPrevious(state.indexes.previous - 1),
          current: state.indexes.previous,
          next: null
        }
      };

    default:
      return state;
  }
}

// for selectors

export const getPagination = (state: PaginationState) => state;
export const getPageIndexes = (state: PaginationState) => state.indexes;
export const getPageCurrentIndex = (state: PaginationState) =>
  state.indexes.current;
export const getPageLinks = (state: PaginationState) => state.links;

// help functions

export function checkUrl(url: string) {
  if (ApiPath.startsWith('_api/') && url.startsWith(WirelinePath)) {
    return url.replace(WirelinePath + '/', '');
  } else {
    return url;
  }
}

export function checkIndexPrevious(index) {
  if (index === -1) {
    return null;
  } else {
    return index;
  }
}
