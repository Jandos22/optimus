// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  EventsActionTypes,
  EventsActionsUnion
} from '../actions/events.actions';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

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

    case EventsActionTypes.INSERT_ONE_EVENT: {
      const event = action.event;
      const ids = [event.ID, ...state.ids] as string[] | number[];
      const entities = { [event.ID]: event, ...state.entities };
      return { ...state, ids, entities };
    }

    case EventsActionTypes.ADD_ONE_EVENT: {
      return adapter.addOne(action.event, state);
    }

    case EventsActionTypes.UPDATE_ONE_EVENT: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case EventsActionTypes.DELETE_ONE_EVENT: {
      return adapter.removeOne(action.id, state);
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
