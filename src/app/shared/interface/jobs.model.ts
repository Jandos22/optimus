import { ClientItem } from './clients.model';
import { SpListItem } from './sp-list-item.model';
import { LocationEnt } from './locations.model';
import { PeopleItem } from './people.model';
import { FieldItem } from './fields.model';

export interface JobItem extends SpListItem {
  id?: number;
  Title?: string;
  iDistrict?: string;
  JobType?: string;
  Well?: string;
  Field?: FieldItem;
  FieldId?: FieldItem;
  Client?: ClientItem;
  ClientId?: ClientItem;
  Rig?: ClientItem;
  RigId?: ClientItem;
  TotalDepth?: number;
  TotalDepthUnits?: string;
  MaxDeviation?: number;
  RigUpStart?: Date;
  RigUpEnd?: Date;
  JobDuration?: number;
  SummarySections?: number;
  JSStitle1?: string;
  JSStitle2?: string;
  JSSbody1?: string;
  JSSbody2?: string;
  Location?: LocationEnt; // lookup single
  LocationId?: number; // lookup single
}

export interface JobsSearchParams {
  text: string;
  locations: number[];
  top: number;
  afterDate?: Date;
  beforeDate?: Date;
}
