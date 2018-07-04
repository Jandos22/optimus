import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { UsersActionTypes, UsersActionsUnion } from '../actions/users.action';

import { PeopleItem } from '../../../../shared/interface/people.model';

export interface UsersState extends EntityState<PeopleItem> {
  searching: boolean;
}

export const adapter: EntityAdapter<PeopleItem> = createEntityAdapter<
  PeopleItem
>({});

export const initialState: UsersState = adapter.getInitialState({
  searching: false
});

export function reducer(
  state = initialState,
  action: UsersActionsUnion
): UsersState {
  switch (action.type) {
    case UsersActionTypes.SEARCH_USERS_START: {
      return { ...state, searching: true };
    }

    case UsersActionTypes.SEARCH_USERS_SUCCESS: {
      const adapted = adapter.addAll(action.users, state);
      return { ...adapted, searching: false };
    }

    case UsersActionTypes.SEARCH_USERS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case UsersActionTypes.INSERT_ONE_USER: {
      const user = action.user;
      const ids = [user.ID, ...state.ids] as string[] | number[];
      const entities = { [user.ID]: user, ...state.entities };
      return { ...state, ids, entities };
    }

    case UsersActionTypes.ADD_ONE_USER: {
      return adapter.addOne(action.user, state);
    }

    case UsersActionTypes.UPDATE_ONE_USER: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
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

export const getUsersSearching = (state: UsersState) => state.searching;
