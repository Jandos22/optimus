import { Action } from '@ngrx/store';

import { TimelineEventType } from '../../../../shared/interface/timeline.model';

export enum EventTypesActionTypes {
  FETCH_EVENT_TYPES = '[Timeline Events] Fetch Event Types',
  FETCH_EVENT_TYPES_SUCCESS = '[Timeline Events] Fetch Event Types Success',
  FILTERING_APPLICABLE_EVENT_TYPES_SUCCESS = '[Timeline Events] Filtering Applicable Event Types Success',
}

export class FetchEventTypesStart implements Action {
  readonly type = EventTypesActionTypes.FETCH_EVENT_TYPES;
}

export class FetchEventTypesSuccess implements Action {
  readonly type = EventTypesActionTypes.FETCH_EVENT_TYPES_SUCCESS;
  constructor(public eventTypes: TimelineEventType[]) {}
}

export class FilteringApplicableEventTypesSuccess implements Action {
  readonly type = EventTypesActionTypes.FILTERING_APPLICABLE_EVENT_TYPES_SUCCESS;
  constructor(public applicableEventTypes: TimelineEventType[]) {}
}

export type EventTypesActionsUnion =
  | FetchEventTypesStart
  | FetchEventTypesSuccess
  | FilteringApplicableEventTypesSuccess;
