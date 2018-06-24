import { Action } from '@ngrx/store';

import { TimelineEventItem } from './../../../../shared/interface/timeline.model';

export enum EventsActionTypes {
  LOAD_TIMELINE_EVENTS = '[Timeline Events] Load Timeline Events',
  LOAD_TIMELINE_EVENTS_SUCCESS = '[Timeline Events] Load Timeline Events Success',
  SEARCH_TRUE = '[Timeline Events] Searching Started',
  SEARCH_FALSE = '[Timeline Events] Searching Finished',
  UPDATE_TOTAL_ITEMS = '[Timeline Events] Update Total Items'
}

export class LoadTimelineEvents implements Action {
  readonly type = EventsActionTypes.LOAD_TIMELINE_EVENTS;
}

export class LoadTimelineEventsSuccess implements Action {
  readonly type = EventsActionTypes.LOAD_TIMELINE_EVENTS_SUCCESS;
  constructor(public events: TimelineEventItem[]) {}
}

export class SearchTrue implements Action {
  readonly type = EventsActionTypes.SEARCH_TRUE;
}

export class SearchFalse implements Action {
  readonly type = EventsActionTypes.SEARCH_FALSE;
}

export class UpdateTotalItems implements Action {
  readonly type = EventsActionTypes.UPDATE_TOTAL_ITEMS;
  constructor(public total: any) {}
}

export type EventsActionsUnion =
  | SearchTrue
  | SearchFalse
  | LoadTimelineEvents
  | LoadTimelineEventsSuccess
  | UpdateTotalItems;
