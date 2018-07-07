import { SpListItem, SpListItemAttachmentFiles } from './sp-list-item.model';
import { LocationEnt } from './locations.model';

export interface TimelineEventItem extends SpListItem {
  id?: number;
  EventDate: Date;
  Title?: string;
  Summary?: string;
  EventReporters?: TimelineEventReporters;
  EventReportersId?: number[];
  EventType?: TimelineEventType;
  EventTypeId?: number[];
  Locations: LocationEnt[];
  LocationsId?: number[];
}

export interface TimelineSearchParams {
  query: string;
  locations: number[];
  top: number;
}

export interface TimelineEventType extends SpListItem {
  Id: number;
  Title: string;
  ApplicableToId?: number[];
  ApplicableTo?: LocationEnt[];
}

export interface TimelineEventReporters {
  results?: TimelineEventItem[];
}
