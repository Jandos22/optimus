import { ClientItem } from './clients.model';
import { SpListItem } from './sp-list-item.model';
import { LocationEnt } from './locations.model';
import { PeopleItem } from './people.model';
import { FieldItem } from './fields.model';
import { ToolItem } from './tools.model';
import { SpHyperlink } from './sp-hyperlink.model';
import { RigItem } from './rigs.model';

export interface JobItem extends SpListItem {
  id?: number;
  Title?: string;
  iDistrict?: string;
  isFDP?: boolean;
  JobFolder?: SpHyperlink;
  JobArchive?: SpHyperlink;
  JobType?: string;
  Well?: string;
  Field?: FieldItem;
  FieldId?: FieldItem;
  Client?: ClientItem;
  ClientId?: ClientItem;
  Rig?: RigItem;
  RigId?: RigItem;
  Ftl?: string;
  TotalDepth?: number;
  TotalDepthUnits?: string;
  HoleSize?: number;
  HoleSizeUnits?: string;
  MudWeight?: number;
  MudWeightUnits?: string;
  MaxDeviation?: number;
  RigUpStart?: Date;
  RigUpEnd?: Date;
  JobDuration?: number;
  ToolsUsed?: {
    results: ToolItem[]; // lookup multiple
  };
  SummarySections?: number;
  JSStitle1?: string;
  JSStitle2?: string;
  JSStitle3?: string;
  JSStitle4?: string;
  JSStitle5?: string;
  JSStitle6?: string;
  JSStitle7?: string;
  JSStitle8?: string;
  JSSbody1?: string;
  JSSbody2?: string;
  JSSbody3?: string;
  JSSbody4?: string;
  JSSbody5?: string;
  JSSbody6?: string;
  JSSbody7?: string;
  JSSbody8?: string;
  Location?: LocationEnt; // lookup single
  LocationId?: number; // lookup single
  EngineersId?: {
    results: PeopleItem[]; // lookup multiple
  };
  OperatorsId?: {
    results: PeopleItem[]; // lookup multiple
  };
}

export interface JobsSearchParams {
  text?: string;
  locations?: number[];
  top?: number;
  afterDate?: Date;
  beforeDate?: Date;
  well?: string;
  rigId?: number;
  jobType?: string;
  engineers?: number[];
  operators?: number[];
}
