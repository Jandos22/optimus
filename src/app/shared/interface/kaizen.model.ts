import { SpListItem, SpListItemAttachmentFiles } from './sp-list-item.model';
import { LocationEnt } from './locations.model';

import { PeopleItem } from './people.model';
import { ArrayOfIds } from './shared.model';

export interface KaizenProjectItem extends SpListItem {
  id?: number;
  ProjectDate?: Date;
  ProjectType?: {
    results?: KaizenProjectType[]; // lookup multiple
  };
  ProjectTypeId?: ArrayOfIds; // lookup multiple
  ImpactType?: KaizenImpactType; // lookup single
  ImpactTypeId?: number; // lookup single
  ValueCreationForClient?: string;
  Title?: string; // min 30, max 70
  Summary?: string; // min 70, max 140
  RichText?: any;
  QuestRIR?: string;
  QuestQPID?: string;
  DoneBy?: {
    results: PeopleItem[]; // lookup multiple
  };
  DoneById?: ArrayOfIds; // lookup multiple
  Locations?: {
    results: LocationEnt[];
  }; // lookup multiple
  LocationsId?: ArrayOfIds; // lookup multiple
  // pseudo field
  New?: boolean;
}

export interface KaizenSearchParams {
  text: string;
  locations: number[];
  top: number;
}

export interface KaizenProjectType extends SpListItem {
  Id: number;
  Title: string;
  ApplicableToId?: number[];
  ApplicableTo?: LocationEnt[];
}

export interface KaizenImpactType extends SpListItem {
  Id: number;
  Title: string;
  ApplicableToId?: number[];
  ApplicableTo?: LocationEnt[];
}
