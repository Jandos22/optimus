import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEvents from './events.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface TimelineState {
  events: fromEvents.EventsState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<TimelineState> = {
  events: fromEvents.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getTimelineState = createFeatureSelector<TimelineState>(
  'timeline'
);
