import { SpListItem } from './sp-list-item.model';
import { LocationEnt } from './locations.model';
import { PeopleItem } from './people.model';

export interface JobItem extends SpListItem {
  id?: number;
  Title?: string;
  iDistrict?: string;
  Well?: string;
  RigUpStart?: Date;
  RigUpEnd?: Date;
  JobDuration?: number;
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
