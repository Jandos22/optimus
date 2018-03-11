import * as fromUsers from '../actions/users.action';
import { User } from '../../models/user.m';

export interface UsersState {
  list: any[];
}

export const initialState: UsersState = {
  list: []
};

export function reducer(
  state = initialState,
  action: fromUsers.PeopleUsersActions
): UsersState {
  switch (action.type) {
    case fromUsers.LOAD_USERS_SUCCESS: {
      return {
        ...state,
        list: action.payload
      };
    }

    case fromUsers.LOAD_USERS_FAIL: {
      return {
        ...state
      };
    }

    case fromUsers.CLEAR_USERS_STATE: {
      return {
        ...state,
        ...initialState
      };
    }

    default:
      return state;
  }
}

export const getUserList = (state: UsersState) => state.list;
