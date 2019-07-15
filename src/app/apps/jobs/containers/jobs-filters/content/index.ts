import { JobsFiltersJobTypeComponent } from './job-types/jobs-filters-job-type.component';
import { JobsFiltersWellComponent } from './well/jobs-filters-well.component';
import { JobsFiltersRigsComponent } from './job-rigs/jobs-filters-rigs.component';

export const filters: any[] = [
  JobsFiltersWellComponent,
  JobsFiltersJobTypeComponent,
  JobsFiltersRigsComponent
];

export * from './well/jobs-filters-well.component';
export * from './job-types/jobs-filters-job-type.component';
export * from './job-rigs/jobs-filters-rigs.component';
