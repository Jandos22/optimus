import { SpListItem } from "./sp-list-item.model";
import { LocationEnt } from "./locations.model";
import { PeopleItem } from "./people.model";
import { JobItem } from "./jobs.model";

export interface AppraisalItem extends SpListItem {
  id?: number;
  Title?: string;
  Date?: Date;
  Job?: JobItem; // lookup single
  JobId?: number; // lookup single
  GivenFor?: PeopleItem; // lookup single
  GivenForId?: number; // lookup single
  GivenBy?: PeopleItem; // lookup single
  GivenById?: number; // lookup single
  OverallPerformance?: string;
  FurtherDevelopment?: string;
  OperatorComments?: string;
  Safety?: string;
  SafetyDetails?: string;
  Proactivity?: string;
  ProactivityDetails?: string;
  Quality?: string;
  QualityDetails?: string;
  WinchDriving?: string;
  WinchDrivingDetails?: string;
  DidRopeSocket?: boolean;
  DidRopeSocketH2S?: boolean;
  DidCollector?: boolean;
  DidHead?: boolean;
  Location?: LocationEnt; // lookup single
  LocationId?: number; // lookup single
}

export interface AppraisalsSearchParams {
  text: string;
  // locations: number[];
  top: number;
  afterDate?: Date;
  beforeDate?: Date;
  givenby?: number; // FE Optimus Account Id (NgPeople)
  givenfor?: number; // FE Optimus Account Id (NgPeople)
  chooseFrom?: number[];
}

export interface AppraisalSkillItem {
  value: string;
  selected: boolean;
  description: string;
}

export interface AppraisalGroupItem extends JobItem {
  appraisals: AppraisalItem[];
}
