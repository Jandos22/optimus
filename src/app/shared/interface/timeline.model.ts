import { PeopleItem } from './people.model';
import {
  SpListItemField,
  SpListItemAttachmentFiles
} from './sp-list-item-field.model';

export interface TimelineEventItem extends SpListItemField {
  id?: number;
  EventDate: Date;
  Title?: string;
  Summary?: string;
  EventReporters?: TimelineEventReporters;
  EventType?: TimelineEventType;
  EventTypeId?: number[];
  LocationsId?: number[];
}

export interface TimelineEventsParams {
  query: string;
  locations: number[];
  top: number;
}

export interface TimelineEventType {
  Id: number;
  Title: string;
}

export interface TimelineEventReporters {
  results?: PeopleItem[];
}
