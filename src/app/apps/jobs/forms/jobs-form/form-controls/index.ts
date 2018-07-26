import { JobsFormDurationComponent } from './jobs-form-duration/jobs-form-duration.component';
import { JobsFormIdistrictComponent } from './jobs-form-idistrict/jobs-form-idistrict.component';
import { JobsFormWellComponent } from './jobs-form-well/jobs-form-well.component';
import { JobsFormTitleComponent } from './jobs-form-title/jobs-form-title.component';
import { JobsFormSummarySectionComponent } from './jobs-form-summary-section/jobs-form-summary-section.component';
import { JobsFormSummarySectionDynamicValidationComponent } from './dynamic-validation/jobs-form-summary-section-dynvalid.component';
import { AddJobsFormSummarySectionComponent } from './buttons/add-jobs-form-summary-section.component';
import { JobsFormJobTypeComponent } from './jobs-form-job-type/jobs-form-job-type.component';
import { JobsFormTotalDepthComponent } from './jobs-form-total-depth/jobs-form-total-depth.component';
import { JobsFormMaxDevComponent } from './jobs-form-max-dev/jobs-form-max-dev.component';

export const forms_controls: any[] = [
  JobsFormTitleComponent,
  JobsFormWellComponent,
  JobsFormIdistrictComponent,
  JobsFormSummarySectionComponent,
  JobsFormSummarySectionDynamicValidationComponent,
  AddJobsFormSummarySectionComponent,
  JobsFormDurationComponent,
  JobsFormJobTypeComponent,
  JobsFormTotalDepthComponent,
  JobsFormMaxDevComponent
];

export * from './jobs-form-title/jobs-form-title.component';
export * from './jobs-form-well/jobs-form-well.component';
export * from './jobs-form-idistrict/jobs-form-idistrict.component';
export * from './jobs-form-summary-section/jobs-form-summary-section.component';
export * from './dynamic-validation/jobs-form-summary-section-dynvalid.component';
export * from './buttons/add-jobs-form-summary-section.component';
export * from './jobs-form-duration/jobs-form-duration.component';
export * from './jobs-form-job-type/jobs-form-job-type.component';
export * from './jobs-form-total-depth/jobs-form-total-depth.component';
export * from './jobs-form-max-dev/jobs-form-max-dev.component';
