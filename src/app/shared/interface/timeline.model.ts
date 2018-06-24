import {
  SpListItemField,
  SpListItemAttachmentFiles
} from './sp-list-item-field.model';

export interface TimelineEventItem extends SpListItemField {
  id?: number;
  EventDate: Date;
  Title?: string;
  Summary?: string;
  EventTypeId?: number[];
  LocationsId?: number[];
}

export interface TimelineEventsParams {
  query: string;
  locations: number[];
  top: number;
}
