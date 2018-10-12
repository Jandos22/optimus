import { SpListItem, SpListItemAttachmentFiles } from './sp-list-item.model';

export interface PeopleItem extends SpListItem {
  New?: boolean;
  id?: number;
  Name?: string;
  Surname?: string;
  Alias?: string;
  Email?: string;
  Gin?: string;
  LocationAssigned?: { Title?: string };
  LocationAssignedId?: number;
  LocationsOfInterestId?: {
    results?: number[];
  };
  Fullname?: string;
  Shortname?: string;
  Position?: UserPosition;
  PositionId?: number;
  Roles?: UserRole[];
  RolesId?: number;
  // pseudo
  selected?: boolean;
}

export interface PeopleUpdatedPhoto {
  ID?: number;
  Filename?: string;
  ArrayBuffer?: ArrayBuffer;
}

export interface ToSaveUserPhoto {
  ID?: number;
  Filename?: string;
  ArrayBuffer?: ArrayBuffer;
}

export interface UserSearchParams {
  text?: string;
  locations?: number[];
  top?: number;
  positions?: number[];
}

export interface SearchParamsUser {
  text: string;
  locations: number[];
  top?: number;
  positions?: number[];
}

export interface UserPosition extends SpListItem {
  Title: string;
  AccessLevel: number;
}

export interface UserRole {
  Title: string;
}
