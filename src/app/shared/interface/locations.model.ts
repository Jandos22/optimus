import { SpListItemField } from './sp-list-item-field.model';

export interface LocationSp extends SpListItemField {
  Id: number;
  ID: number;
  Title: string;
}

export interface LocationEnt extends LocationSp, SpListItemField {
  id: number;
}
