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
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<TimelineEventItem> = createEntityAdapter<
  TimelineEventItem
>({});

// compose initial state here
export const initialState: EventsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: EventsActionsUnion
): EventsState {
  switch (action.type) {
    case EventsActionTypes.SEARCH_EVENTS_START: {
      return { ...state, searching: true };
    }

    case EventsActionTypes.SEARCH_EVENTS_SUCCESS: {
      const adapted = adapter.addAll(action.events, state);
      return { ...adapted, searching: false };
    }

    case EventsActionTypes.SEARCH_EVENTS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
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

export const getEventsSearching = (state: EventsState) => state.searching;
