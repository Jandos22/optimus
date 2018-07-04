import { Action } from '@ngrx/store';

import { TimelineEventItem } from './../../../../shared/interface/timeline.model';

export enum EventsActionTypes {
  SEARCH_EVENTS_START = '[Timeline Events] Search Events Start',
  SEARCH_EVENTS_SUCCESS = '[Timeline Events] Search Events Success',
  SEARCH_EVENTS_NO_RESULTS = '[Timeline Events] Search Events No Results',
  COUNT_EVENTS_TOTAL = '[Timeline Events] Count Total (since next url is present)'
}

export class SearchEventsStart implements Action {
  readonly type = EventsActionTypes.SEARCH_EVENTS_START;
  constructor(public url: string) {}
}

export class SearchEventsSuccess implements Action {
  readonly type = EventsActionTypes.SEARCH_EVENTS_SUCCESS;
  constructor(public events: TimelineEventItem[]) {}
}

export class SearchEventsNoResults implements Action {
  readonly type = EventsActionTypes.SEARCH_EVENTS_NO_RESULTS;
}

export class CountEventsTotal implements Action {
  readonly type = EventsActionTypes.COUNT_EVENTS_TOTAL;
}

export type EventsActionsUnion =
  | SearchEventsStart
  | SearchEventsSuccess
  | SearchEventsNoResults
  | CountEventsTotal;
