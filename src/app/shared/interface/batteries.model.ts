import { SpListItem } from "./sp-list-item.model";
import { LocationEnt } from "./locations.model";
import { PeopleItem } from "../../apps/people/models/people-item.model";

export interface BatteryItem extends SpListItem {
  id?: number;
  Title?: string;
  Serial?: string;
  PN?: string;
  ManufDate?: Date;
  Jobs?: Number;
  Junked?: Boolean;
  Hours?: Number;
  PercentUsed?: Number;
  DepassDate?: Date;
  Status?: string;
  Details?: string;
  FollowUpById?: number;
  FollowUpBy?: PeopleItem;
  LastFollowUp?: Date;
  Location?: LocationEnt;
  LocationId?: number;
  New?: boolean;
}

export interface BatteriesSearchParams {
  text?: string;
  locations?: number[];
  top?: number;
}
