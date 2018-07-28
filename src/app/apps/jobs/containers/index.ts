import { JobsComponent } from './jobs/jobs.component';
import { JobsHeaderComponent } from './jobs-header/jobs-header.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsFooterComponent } from './jobs-footer/jobs-footer.component';
import { JobsToolbarComponent } from './jobs-toolbar/jobs-toolbar.component';

export const containers: any[] = [
  JobsComponent,
  JobsHeaderComponent,
  JobsToolbarComponent,
  JobsListComponent,
  JobsFooterComponent
];

export * from './jobs/jobs.component';
export * from './jobs-header/jobs-header.component';
export * from './jobs-toolbar/jobs-toolbar.component';
export * from './jobs-list/jobs-list.component';
export * from './jobs-footer/jobs-footer.component';
