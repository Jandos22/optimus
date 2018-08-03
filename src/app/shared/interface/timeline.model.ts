import { SpListItem, SpListItemAttachmentFiles } from './sp-list-item.model';
import { LocationEnt } from './locations.model';

import { PeopleItem } from './people.model';

export interface TimelineEventItem extends SpListItem {
  id?: number;
  EventDate?: Date;
  Title?: string;
  Summary?: string;
  RichText?: any;
  EventReporters?: TimelineEventReporters;
  EventReportersId?: TimelineEventReportersId;
  EventType?: TimelineEventType;
  EventTypeId?: number[];
  Locations?: LocationEnt[];
  LocationsId?: TimelineLocationsId;
  HashTags?: string;
  // pseudo field
  New?: boolean;
}

export interface TimelineSearchParams {
  text: string;
  locations: number[];
  top: number;
}

export interface TimelineEventType extends SpListItem {
  Id: number;
  Title: string;
  ApplicableToId?: number[];
  ApplicableTo?: LocationEnt[];
}

export interface TimelineEventReportersId {
  results?: number[];
}

export interface TimelineEventReporters {
  results?: PeopleItem[];
}

export interface TimelineLocationsId {
  results?: number[];
}

export interface ToSaveEventImage {
  ID?: number;
  ArrayBuffer?: ArrayBuffer;
}
