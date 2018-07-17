import { SpListItem } from './sp-list-item.model';
import { LocationEnt } from './locations.model';
import { PeopleItem } from './people.model';

export interface ExemptionItem extends SpListItem {
  id?: number;
  Title?: string;
  Summary?: string;
  ExpiryDate?: Date;
  Status?: string;
  PendingActions?: string;
  QuestNumber?: string;
  QuestQPID?: string;
  Location?: LocationEnt; // lookup single
  LocationId?: number; // lookup single
  HashTags?: string;
  Submitter?: PeopleItem; // lookup single
  SubmitterId?: number; // lookup single
}

export interface ExemptionsSearchParams {
  text: string;
  locations: number[];
  top: number;
  status?: string;
  afterDate?: Date;
  beforeDate?: Date;
}
