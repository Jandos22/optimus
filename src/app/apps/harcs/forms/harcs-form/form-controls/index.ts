import { HarcsFormExpiryDateComponent } from './harcs-form-expiry-date/harcs-form-expiry-date.component';
import { HarcsFormQuestNumberComponent } from './harcs-form-quest-number/harcs-form-quest-number.component';
import { HarcsFormQuestQpidComponent } from './harcs-form-quest-qpid/harcs-form-quest-qpid.component';
import { HarcsFormStatusComponent } from './harcs-form-status/harcs-form-status.component';
import { HarcsFormPendingComponent } from './harcs-form-pending/harcs-form-pending.component';

export const forms_controls: any[] = [
  HarcsFormExpiryDateComponent,
  HarcsFormStatusComponent,
  HarcsFormPendingComponent,
  HarcsFormQuestNumberComponent,
  HarcsFormQuestQpidComponent
];

export * from './harcs-form-expiry-date/harcs-form-expiry-date.component';
export * from './harcs-form-quest-number/harcs-form-quest-number.component';
export * from './harcs-form-quest-qpid/harcs-form-quest-qpid.component';
export * from './harcs-form-status/harcs-form-status.component';
export * from './harcs-form-pending/harcs-form-pending.component';
