import { HeaderLocationComponent } from './header/header-location/header-location.component';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderLocationSelectorComponent } from './header/header-location-selector/header-location-selector.component';

export const containers: any[] = [
  LayoutComponent,
  HeaderComponent,
  SidenavComponent,
  HeaderLocationComponent,
  HeaderLocationSelectorComponent
];

export * from './layout.component';
export * from './header/header.component';
export * from './sidenav/sidenav.component';
export * from './header/header-location-selector/header-location-selector.component';
export * from './header/header-location/header-location.component';
