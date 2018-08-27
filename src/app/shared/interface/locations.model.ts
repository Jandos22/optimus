import { AppItem } from './applications.model';
import { SpListItem } from './sp-list-item.model';
import { SpHyperlink } from './sp-hyperlink.model';

export interface LocationEnt extends SpListItem {
  id?: number;
  Title?: string; // KZTZ
  Name?: string; // Tengiz
  ApplicationsInUse?: AppItem[];
  ApplicationsInUseId?: {
    results?: number[];
  };
  PositionInList?: number;
  HasLocationsId?: number[];
  HasLocations?: {
    results?: LocationEnt[];
  };
  // for weather app
  OwmApiKey?: string;
  Latitude?: string;
  Longitude?: string;
  ShowWeather?: boolean;
  WeatherCurrent?: string;
  WeatherCurrentTime?: Date;
  WeatherForecast?: string;
  WeatherForecastTime?: Date;
  WeatherUnits?: string;
  Link1?: string;
  Link01?: SpHyperlink;
  Link2?: string;
  Link02?: SpHyperlink;
  Link3?: string;
  Link03?: SpHyperlink;
  Link4?: string;
  Link04?: SpHyperlink;
}
