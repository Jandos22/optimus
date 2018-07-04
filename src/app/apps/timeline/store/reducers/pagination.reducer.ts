// actions
import {
  PaginationActionTypes,
  PaginationActionsUnion
} from '../actions/pagination.actions';

import * as _ from 'lodash';

// constants
import { WirelinePath, ApiPath } from './../../../../shared/constants/index';

export interface PaginationState {
  currentIndex: number;
  links: string[];
  totalDisplayed: number;
  totalExist: number;
}

export const initialState: PaginationState = {
  currentIndex: 0,
  links: [],
  totalDisplayed: 0,
  totalExist: null
};

export function reducer(
  state = initialState,
  action: PaginationActionsUnion
): PaginationState {
  switch (action.type) {
    case PaginationActionTypes.RESET_PAGINATION:
      return {
        ...state,
        ...initialState
      };

    case PaginationActionTypes.UPDATE_TOTAL_DISPLAYED: {
      const totalDisplayed = action.totalDisplayed;
      return { ...state, totalDisplayed };
    }

    case PaginationActionTypes.UPDATE_TOTAL_EXIST: {
      const totalExist = action.totalExist;
      return { ...state, totalExist };
    }

    case PaginationActionTypes.ADD_LINK:
      return {
        ...state,
        links: [...state.links, checkUrl(action.url)]
      };

    case PaginationActionTypes.REMOVE_LINK:
      const links = _.slice(state.links, 0, action.index + 1);
      console.log(links);
      return { ...state, links };

    // run when NEXT button is clicked
    case PaginationActionTypes.ON_NEXT:
      return { ...state, currentIndex: state.currentIndex + 1 };

    // run when BACK button is clicked
    case PaginationActionTypes.ON_BACK:
      return { ...state, currentIndex: state.currentIndex - 1 };

    default:
      return state;
  }
}

// for selectors

export const getPagination = (state: PaginationState) => state;
export const getCurrentIndex = (state: PaginationState) => state.currentIndex;
export const getPageLinks = (state: PaginationState) => state.links;
export const getTotalDisplayed = (state: PaginationState) =>
  state.totalDisplayed;
export const getTotalExist = (state: PaginationState) => state.totalExist;

// help functions

export function checkUrl(url: string) {
  if (ApiPath.startsWith('_api/') && url.startsWith(WirelinePath)) {
    return url.replace(WirelinePath + '/', '');
  } else {
    return url;
  }
}
