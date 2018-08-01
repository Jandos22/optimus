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

// export class PeopleItemObject implements PeopleItem {
//   id;
//   ID;
//   Name = '';
//   Surname = '';
//   Alias = '';
//   Email = '';
//   Gin = '';
//   LocationAssigned;
//   LocationAssignedId: number = null;
//   Fullname: '';
//   Shortname: '';
//   ['odata.type'];
//   ['odata.id'];
//   ['odata.etag'];
//   ['odata.editLink'];
//   Attachments = false;
//   AttachmentFiles: {
//     results?: SpListItemAttachmentFiles[];
//   };
//   PositionId;
//   Position;
//   RolesId;
//   Roles;
//   constructor(item?: PeopleItem) {
//     console.log(item);
//     if (item) {
//       this.Name = item.Name;
//       this.Surname = item.Surname;
//       this.Alias = item.Alias;
//       this.Email = item.Email;
//       this.Gin = item.Gin;
//       this.Fullname = item.Fullname;
//       this.Shortname = item.Shortname;
//       this.LocationAssigned = item.LocationAssigned;
//       this.LocationAssignedId = item.LocationAssignedId;
//       this.Attachments = item.Attachments;
//       this.AttachmentFiles = item.AttachmentFiles;
//       this.PositionId = item.PositionId;
//       this.Position = item.Position;
//       this.RolesId = item.RolesId;
//       this.Roles = item.Roles;
//     }
//   }
// }

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
  query: string;
  locations: number[];
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
