import { SpListItem } from './sp-list-item.model';
import { LocationEnt } from './locations.model';
import { PeopleItem } from './people.model';

export interface HarcItem extends SpListItem {
  id?: number;
  Title?: string;
  ExpiryDate?: Date;
  Status?: string;
  PendingActions?: string;
  QuestNumber?: string;
  QuestQPID?: string;
  Location?: LocationEnt; // lookup single
  LocationId?: number; // lookup single
  PIC?: PeopleItem; // lookup single
  PICId?: number; // lookup single
}

export interface HarcsSearchParams {
  text?: string;
  locations?: number[];
  top?: number;
  status?: string[];
  afterDate?: Date;
  beforeDate?: Date;
  pic?: number[];
}
