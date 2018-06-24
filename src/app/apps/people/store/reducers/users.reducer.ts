import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { UsersActionTypes, UsersActionsUnion } from '../actions/users.action';

import { PeopleItem } from '../../../../shared/interface/people.model';

export interface UsersState extends EntityState<PeopleItem> {
  total: any;
  searching: boolean;
}

export const adapter: EntityAdapter<PeopleItem> = createEntityAdapter<
  PeopleItem
>({});

export const initialState: UsersState = adapter.getInitialState({
  total: null,
  searching: false
});

export function reducer(
  state = initialState,
  action: UsersActionsUnion
): UsersState {
  switch (action.type) {
    case UsersActionTypes.SEARCH_TRUE: {
      return {
        ...state,
        searching: true
      };
    }

    case UsersActionTypes.SEARCH_FALSE: {
      return {
        ...state,
        searching: false
      };
    }

    case UsersActionTypes.UPDATE_PEOPLE_LIST: {
      return adapter.addAll(action.users, state);
    }

    case UsersActionTypes.UPDATE_ONE_USER: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    // case fromNgPeople.UPDATE_PEOPLE_LIST: {
    //   return {
    //     ...state,
    //     list: action.payload
    //   };
    // }

    // case fromNgPeople.ERROR_GET_PEOPLE: {
    //   return {
    //     ...state,
    //     errors: [...action.error]
    //   };
    // }

    case UsersActionTypes.UPDATE_TOTAL_ITEMS: {
      return {
        ...state,
        total: action.total
      };
    }

    default:
      return state;
  }
}

export const {
  selectIds: selectUsersIds,
  selectEntities: selectUsersEntities,
  selectAll: selectAllUsers,
  selectTotal: selectUsersTotal
} = adapter.getSelectors();

// export const getNgPeopleList = (state: UsersState) => state.list;
export const getUsersTotal = (state: UsersState) => state.total;
export const getUsersSearching = (state: UsersState) => state.searching;
