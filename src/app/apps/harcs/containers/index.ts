import { HarcsComponent } from './harcs/harcs.component';
import { HarcsHeaderComponent } from './harcs-header/harcs-header.component';
import { HarcsListComponent } from './harcs-list/harcs-list.component';
import { HarcsFooterComponent } from './harcs-footer/harcs-footer.component';
import { HarcsToolbarComponent } from './harcs-toolbar/harcs-toolbar.component';

export const containers: any[] = [
  HarcsComponent,
  HarcsHeaderComponent,
  HarcsToolbarComponent,
  HarcsListComponent,
  HarcsFooterComponent
];

export * from './harcs/harcs.component';
export * from './harcs-header/harcs-header.component';
export * from './harcs-toolbar/harcs-toolbar.component';
export * from './harcs-list/harcs-list.component';
export * from './harcs-footer/harcs-footer.component';
