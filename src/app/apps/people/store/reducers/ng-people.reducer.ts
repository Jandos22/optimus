import * as fromNgPeople from '../actions/ng-people.action';
import { User } from '../../models/user.m';

export interface NgPeopleState {
  list: any[];
  total: any;
  state: {
    searching: boolean;
    errors: any[];
  };
}

export const initialState: NgPeopleState = {
  list: [],
  total: null,
  state: {
    searching: false,
    errors: []
  }
};

export function reducer(
  state = initialState,
  action: fromNgPeople.NgPeopleActions
): NgPeopleState {
  switch (action.type) {
    case fromNgPeople.UPDATE_PEOPLE_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }

    case fromNgPeople.ERROR_GET_PEOPLE: {
      return {
        ...state,
        state: {
          ...state.state,
          errors: [...state.state.errors, action.error]
        }
      };
    }

    case fromNgPeople.UPDATE_TOTAL_ITEMS: {
      return {
        ...state,
        total: action.total
      };
    }

    default:
      return state;
  }
}

export const getNgPeopleList = (state: NgPeopleState) => state.list;
export const getNgPeopleTotal = (state: NgPeopleState) => state.total;
