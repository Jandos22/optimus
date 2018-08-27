import { JobsFiltersJobTypeComponent } from './job-types/jobs-filters-job-type.component';
import { JobsFiltersWellComponent } from './well/jobs-filters-well.component';

export const filters: any[] = [
  JobsFiltersWellComponent,
  JobsFiltersJobTypeComponent
];

export * from './well/jobs-filters-well.component';
export * from './job-types/jobs-filters-job-type.component';
