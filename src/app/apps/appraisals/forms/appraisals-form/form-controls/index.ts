import { AppraisalsFormDidRopeSocketComponent } from './did-ropesocket/appraisals-form-did-ropesocket.component';
import { AppraisalsFormWinchComponent } from './winch/appraisals-form-winch.component';
import { AppraisalsFormProactivityComponent } from './proactivity/appraisals-form-proactivity.component';
import { AppraisalsFormJobComponent } from './job/appraisals-form-job.component';
import { AppraisalsFormDateComponent } from './date/appraisals-form-date.component';
import { AppraisalsFormOverallPerformanceComponent } from './overall-performance/appraisals-form-overall-performance.component';
import { AppraisalsFormFurtherDevelopmentComponent } from './further-development/appraisals-form-further-development.component';
import { AppraisalsFormSafetyComponent } from './safety/appraisals-form-safety.component';
import { AppraisalsFormQualityComponent } from './quality/appraisals-form-quality.component';
import { AppraisalsFormDidCollectorComponent } from './did-collector/appraisals-form-did-collector.component';
import { AppraisalsFormDidHeadComponent } from './did-head/appraisals-form-did-head.component';
import { AppraisalsFormDidRopeSocketH2SComponent } from './did-ropesocket-h2s/appraisals-form-did-ropesocket-h2s.component';
import { AppraisalsFormOperatorCommentsComponent } from './operator-comments/appraisals-form-operator-comments.component';

export const forms_controls: any[] = [
  AppraisalsFormDateComponent,
  AppraisalsFormJobComponent,
  AppraisalsFormOverallPerformanceComponent,
  AppraisalsFormFurtherDevelopmentComponent,
  AppraisalsFormOperatorCommentsComponent,
  AppraisalsFormProactivityComponent,
  AppraisalsFormSafetyComponent,
  AppraisalsFormQualityComponent,
  AppraisalsFormWinchComponent,
  AppraisalsFormDidRopeSocketComponent,
  AppraisalsFormDidRopeSocketH2SComponent,
  AppraisalsFormDidCollectorComponent,
  AppraisalsFormDidHeadComponent
];

export * from './date/appraisals-form-date.component';
export * from './job/appraisals-form-job.component';
export * from './overall-performance/appraisals-form-overall-performance.component';
export * from './further-development/appraisals-form-further-development.component';
export * from './proactivity/appraisals-form-proactivity.component';
export * from './safety/appraisals-form-safety.component';
export * from './quality/appraisals-form-quality.component';
export * from './winch/appraisals-form-winch.component';
export * from './did-ropesocket/appraisals-form-did-ropesocket.component';
export * from './did-collector/appraisals-form-did-collector.component';
export * from './did-head/appraisals-form-did-head.component';
export * from './did-ropesocket-h2s/appraisals-form-did-ropesocket-h2s.component';
export * from './operator-comments/appraisals-form-operator-comments.component';
