// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  PeoplePositionsActionTypes,
  PeoplePositionsActionsUnion
} from '../actions/people-positions.actions';

// interfaces
import { UserPosition } from '../../../../shared/interface/people.model';

// compose reducer state shape here
export interface PeoplePositionsState extends EntityState<UserPosition> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<UserPosition> = createEntityAdapter<
  UserPosition
>({});

// compose initial state here
export const initialState: PeoplePositionsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: PeoplePositionsActionsUnion
): PeoplePositionsState {
  switch (action.type) {
    case PeoplePositionsActionTypes.FETCH_PEOPLE_POSITIONS: {
      return { ...state, searching: true };
    }

    case PeoplePositionsActionTypes.FETCH_PEOPLE_POSITIONS_SUCCESS: {
      const adapted = adapter.addAll(action.peoplePositions, state);
      return { ...adapted, searching: false };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectPeoplePositionsIds,
  selectEntities: selectPeoplePositionsEntities,
  selectAll: selectAllPeoplePositions,
  selectTotal: selectPeoplePositionsTotal
} = adapter.getSelectors();

export const getPeoplePositionsSearching = (state: PeoplePositionsState) =>
  state.searching;
