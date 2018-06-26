import {
  SpListItemField,
  SpListItemAttachmentFiles
} from './sp-list-item-field.model';

export interface PeopleItem extends SpListItemField {
  id?: number;
  Name?: string;
  Surname?: string;
  Alias?: string;
  Email?: string;
  Gin?: string;
  LocationAssignedId?: number;
  LocationsOfInterestId?: number[];
  Fullname?: string;
  Photo?: {
    Filename: string;
    ArrayBuffer: ArrayBuffer;
  };
}

export class PeopleItemObject implements PeopleItem {
  id;
  ID;
  Name = '';
  Surname = '';
  Alias = '';
  Email = '';
  Gin = '';
  LocationAssignedId: number = null;
  Fullname: '';
  ['odata.type'];
  ['odata.id'];
  ['odata.etag'];
  ['odata.editLink'];
  Attachments = false;
  AttachmentFiles: {
    results?: SpListItemAttachmentFiles[];
  };
  Photo = {
    Filename: '',
    ArrayBuffer: new ArrayBuffer(0)
  };
  constructor(item?: PeopleItem) {
    console.log(item);
    if (item) {
      this.Name = item.Name;
      this.Surname = item.Surname;
      this.Alias = item.Alias;
      this.Email = item.Email;
      this.Gin = item.Gin;
      this.LocationAssignedId = item.LocationAssignedId;
      this.Attachments = item.Attachments;
      this.AttachmentFiles = item.AttachmentFiles;
      if (item.Attachments) {
        this.Photo.Filename = `${item.Alias}.jpg`;
      }
    }
  }
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
