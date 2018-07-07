// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  EventTypesActionTypes,
  EventTypesActionsUnion
} from '../actions/event-types.actions';

// interfaces
import { TimelineEventType } from './../../../../shared/interface/timeline.model';

// compose reducer state shape here
export interface EventTypesState extends EntityState<TimelineEventType> {
  applicable: TimelineEventType[];
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<TimelineEventType> = createEntityAdapter<
  TimelineEventType
>({});

// compose initial state here
export const initialState: EventTypesState = adapter.getInitialState({
  applicable: [],
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: EventTypesActionsUnion
): EventTypesState {
  switch (action.type) {
    case EventTypesActionTypes.FETCH_EVENT_TYPES: {
      return { ...state, searching: true };
    }

    case EventTypesActionTypes.FETCH_EVENT_TYPES_SUCCESS: {
      const adapted = adapter.addAll(action.eventTypes, state);
      return { ...adapted, searching: false };
    }

    case EventTypesActionTypes.FILTERING_APPLICABLE_EVENT_TYPES_SUCCESS: {
      return { ...state, applicable: action.applicableEventTypes };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectEventTypesIds,
  selectEntities: selectEventTypesEntities,
  selectAll: selectAllEventTypes,
  selectTotal: selectEventTypesTotal
} = adapter.getSelectors();

export const getEventTypesSearching = (state: EventTypesState) => state.searching;
export const getApplicableEventTypes = (state: EventTypesState) => state.applicable;
