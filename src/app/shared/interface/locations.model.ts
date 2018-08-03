import { AppItem } from './applications.model';
import { SpListItem } from './sp-list-item.model';

export interface LocationEnt extends SpListItem {
  id: number;
  Title: string;
  ApplicationsInUse: AppItem[];
  PositionInList: number;
  HasLocationsId: number[];
  HasLocations: {
    results: LocationEnt[];
  };
}
