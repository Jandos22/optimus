import { SpListItem, SpListItemAttachmentFiles } from './sp-list-item.model';
import { LocationEnt } from './locations.model';

import { PeopleItem } from './people.model';

export interface TimelineEventItem extends SpListItem {
  id?: number;
  EventDate?: Date;
  EventType2?: string;
  IssueState?: string;
  Title?: string;
  Summary?: string;
  FollowUp?: string;
  RichText?: any;
  // lookup multiple
  EventReportersId?: {
    results?: number[];
  };
  EventReporters?: TimelineEventReporters;
  // lookup single
  EventType?: TimelineEventType;
  EventTypeId?: number[];
  Locations?: {
    results?: LocationEnt[];
  };
  LocationsId?: {
    results?: number[];
  };
  // HashTags?: string;
  // pseudo field
  New?: boolean;

  // FollowUpBy?: {
  // results: number[];
  // };
  QuestNumber?: string;
  QuestQPID?: string;
}

export interface TimelineSearchParams {
  text: string;
  locations: number[];
  top: number;
  // eventTypes?: number[];
  eventType?: string;
  eventReporters?: number[];
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
