import { WeatherCardComponent } from './weather-card.component';
import { WeatherLineComponent } from './weather-line/weather-line.component';
import { LocationLinksComponent } from './links/location-links.component';
import { LocationLinkComponent } from './link/location-link.component';

export const components: any[] = [
  WeatherCardComponent,
  WeatherLineComponent,
  LocationLinksComponent,
  LocationLinkComponent
];

export * from './weather-card.component';
export * from './weather-line/weather-line.component';
export * from './links/location-links.component';
export * from './link/location-link.component';
