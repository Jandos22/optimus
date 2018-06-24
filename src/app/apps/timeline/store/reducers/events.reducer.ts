// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  EventsActionTypes,
  EventsActionsUnion
} from '../actions/events.actions';

// interfaces
import { TimelineEventItem } from './../../../../shared/interface/timeline.model';

// compose reducer state shape here
export interface EventsState extends EntityState<TimelineEventItem> {
  total: any;
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<TimelineEventItem> = createEntityAdapter<
  TimelineEventItem
>({});

// compose initial state here
export const initialState: EventsState = adapter.getInitialState({
  total: null,
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: EventsActionsUnion
): EventsState {
  switch (action.type) {
    case EventsActionTypes.LOAD_TIMELINE_EVENTS_SUCCESS: {
      return adapter.addAll(action.events, state);
    }

    case EventsActionTypes.SEARCH_TRUE: {
      return {
        ...state,
        searching: true
      };
    }

    case EventsActionTypes.SEARCH_FALSE: {
      return {
        ...state,
        searching: false
      };
    }

    case EventsActionTypes.UPDATE_TOTAL_ITEMS: {
      return {
        ...state,
        total: action.total
      };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectEventsIds,
  selectEntities: selectEventsEntities,
  selectAll: selectAllEvents,
  selectTotal: selectEventsTotal
} = adapter.getSelectors();

// custom selectors not covered by adapter
// export const getNgPeopleList = (state: UsersState) => state.list;
// export const getUsersTotal = (state: EventsState) => state.total;
