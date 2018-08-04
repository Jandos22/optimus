import { JobsComponent } from './jobs/jobs.component';
import { JobsHeaderComponent } from './jobs-header/jobs-header.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsFooterComponent } from './jobs-footer/jobs-footer.component';
import { JobsToolbarComponent } from './jobs-toolbar/jobs-toolbar.component';
import { JobsFiltersComponent } from './jobs-filters/jobs-filters.component';
import { JobsFiltersHeaderComponent } from './jobs-filters/header/jobs-filters-header.component';
import { JobsFiltersContentComponent } from './jobs-filters/content/jobs-filters-content.component';
import { JobsFiltersFooterComponent } from './jobs-filters/footer/jobs-filters-footer.component';

export const containers: any[] = [
  JobsComponent,
  JobsHeaderComponent,
  JobsToolbarComponent,
  JobsListComponent,
  JobsFooterComponent,
  JobsFiltersComponent,
  JobsFiltersHeaderComponent,
  JobsFiltersContentComponent,
  JobsFiltersFooterComponent
];

export * from './jobs/jobs.component';
export * from './jobs-header/jobs-header.component';
export * from './jobs-toolbar/jobs-toolbar.component';
export * from './jobs-list/jobs-list.component';
export * from './jobs-footer/jobs-footer.component';
export * from './jobs-filters/jobs-filters.component';
export * from './jobs-filters/header/jobs-filters-header.component';
export * from './jobs-filters/content/jobs-filters-content.component';
export * from './jobs-filters/footer/jobs-filters-footer.component';
