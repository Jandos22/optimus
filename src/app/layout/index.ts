import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

export const containers: any[] = [
  LayoutComponent,
  HeaderComponent,
  SidenavComponent
];

export * from './layout.component';
export * from './header/header.component';
export * from './sidenav/sidenav.component';
