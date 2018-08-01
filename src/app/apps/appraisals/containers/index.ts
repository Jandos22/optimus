import { AppraisalsComponent } from './appraisals/appraisals.component';
import { AppraisalsHeaderComponent } from './appraisals-header/appraisals-header.component';
import { AppraisalsListComponent } from './appraisals-list/appraisals-list.component';
import { AppraisalsFooterComponent } from './appraisals-footer/appraisals-footer.component';
import { AppraisalsToolbarComponent } from './appraisals-toolbar/appraisals-toolbar.component';

export const containers: any[] = [
  AppraisalsComponent,
  AppraisalsHeaderComponent,
  AppraisalsToolbarComponent,
  AppraisalsListComponent,
  AppraisalsFooterComponent
];

export * from './appraisals/appraisals.component';
export * from './appraisals-header/appraisals-header.component';
export * from './appraisals-toolbar/appraisals-toolbar.component';
export * from './appraisals-list/appraisals-list.component';
export * from './appraisals-footer/appraisals-footer.component';
