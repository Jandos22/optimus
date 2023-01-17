import { SpListItem } from "./sp-list-item.model";
import { LocationEnt } from "./locations.model";
import { PeopleItem } from "../../apps/people/models/people-item.model";

export interface BatteryItem extends SpListItem {
  id?: number;
  Title?: string;
  Serial?: string;
  PN?: string;
  Hours?: number;
  Status?: string;
  Details?: string;
  Location?: LocationEnt;
  LocationId?: number;
  LastUpdated?: Date;
  LastUpdatedBy?: PeopleItem;
  LastUpdatedById?: number;
  LastUpdatedFlag?: boolean;
}

export interface BatteriesSearchParams {
  text?: string;
  status?: string;
  locations?: number[];
  top?: number;
}
