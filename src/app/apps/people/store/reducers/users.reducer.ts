import * as fromUsers from '../actions/users.action';
import { User } from '../../models/user.m';

export interface UsersState {
  entities: { [id: number]: User };
  loading: boolean;
  loaded: boolean;
}

export const initialState: UsersState = {
  entities: {},
  loading: false,
  loaded: false
};

export function reducer(
  state = initialState,
  action: fromUsers.PeopleUsersActions
): UsersState {
  switch (action.type) {
    case fromUsers.LOAD_USERS:
      return {
        ...state,
        loading: true
      };

    case fromUsers.LOAD_USERS_SUCCESS: {
      const users = action.payload;
      console.log(users);
      const entity = users.reduce(
        (entities: { [id: number]: User }, user: User) => {
          return {
            ...entities,
            [user.Id]: user
          };
        },
        { ...state.entities }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities: entity
      };
    }

    case fromUsers.LOAD_USERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
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

export const getUserEntities = (state: UsersState) => state.entities;
export const getUsersLoading = (state: UsersState) => state.loading;
export const getUsersLoaded = (state: UsersState) => state.loaded;
