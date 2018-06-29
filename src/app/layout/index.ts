import { LayoutComponent } from './layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavHeaderComponent } from './sidenav/sidenav-header/sidenav-header.component';
import { SidenavFooterComponent } from './sidenav/sidenav-footer/sidenav-footer.component';
import { SidenavHeaderNoAccountComponent } from './sidenav/sidenav-header-no-account/sidenav-header-no-account.component';
import { BootstrapUserComponent } from './bootstrap-user/bootstrap-user.component';

export const containers: any[] = [
  LayoutComponent,
  SidenavComponent,
  SidenavHeaderComponent,
  SidenavHeaderNoAccountComponent,
  SidenavFooterComponent,
  BootstrapUserComponent
];

export * from './layout.component';
export * from './sidenav/sidenav.component';
export * from './sidenav/sidenav-header/sidenav-header.component';
export * from './sidenav/sidenav-footer/sidenav-footer.component';
export * from './sidenav/sidenav-header-no-account/sidenav-header-no-account.component';
export * from './bootstrap-user/bootstrap-user.component';
