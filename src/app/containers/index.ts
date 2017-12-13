import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

export const containers: any[] = [
  LayoutComponent,
  HeaderComponent,
  SidenavComponent
];

export * from './layout/layout.component';
export * from './layout/header/header.component';
export * from './layout/sidenav/sidenav.component';
