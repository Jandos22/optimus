import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEvents from './events.reducer';
import * as fromEventTypes from './event-types.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface TimelineState {
  events: fromEvents.EventsState;
  eventTypes: fromEventTypes.EventTypesState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<TimelineState> = {
  events: fromEvents.reducer,
  eventTypes: fromEventTypes.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getTimelineState = createFeatureSelector<TimelineState>(
  'timeline'
);
