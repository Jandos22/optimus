import { JobsListItemComponent } from './jobs-list-item/jobs-list-item.component';
import { JobsListItemV2Component } from './jobs-list-item-v2/jobs-list-item-v2.component';
import { JobsJobSummaryListComponent } from './job-summary/jobs-job-summary-list.component';

export const components: any[] = [
  JobsListItemComponent,
  JobsListItemV2Component,
  JobsJobSummaryListComponent // part of JobsListItemV2Component
];

export * from './jobs-list-item/jobs-list-item.component';
export * from './jobs-list-item-v2/jobs-list-item-v2.component';
export * from './job-summary/jobs-job-summary-list.component';
