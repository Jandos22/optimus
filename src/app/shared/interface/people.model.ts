import { SpListItemField } from './sp-list-item-field.model';

export interface PeopleItem extends SpListItemField {
  Name: string;
  Surname: string;
  Alias: string;
  Email: string;
  Gin: string;
  LocationAssignedId: number;
}

export class PeopleItemObject implements PeopleItem {
  ID;
  Name = '';
  Surname = '';
  Alias = '';
  Email = '';
  Gin = '';
  LocationAssignedId: number = null;
  ['odata.type'];
  ['odata.id'];
  ['odata.etag'];
  ['odata.editLink'];
  constructor(item?: PeopleItem) {
    console.log(item);
    if (item) {
      this.Name = item.Name;
      this.Surname = item.Surname;
      this.Alias = item.Alias;
      this.Email = item.Email;
      this.Gin = item.Gin;
      this.LocationAssignedId = item.LocationAssignedId;
    }
  }
}
