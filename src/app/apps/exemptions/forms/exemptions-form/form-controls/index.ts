import { ExemptionsFormExpiryDateComponent } from './exemptions-form-expiry-date/exemptions-form-expiry-date.component';
import { ExemptionsFormQuestNumberComponent } from './exemptions-form-quest-number/exemptions-form-quest-number.component';
import { ExemptionsFormQuestQpidComponent } from './exemptions-form-quest-qpid/exemptions-form-quest-qpid.component';
import { ExemptionsFormStatusComponent } from './exemptions-form-status/exemptions-form-status.component';
import { ExemptionsFormPendingComponent } from './exemptions-form-pending/exemptions-form-pending.component';

export const forms_controls: any[] = [
  ExemptionsFormExpiryDateComponent,
  ExemptionsFormStatusComponent,
  ExemptionsFormPendingComponent,
  ExemptionsFormQuestNumberComponent,
  ExemptionsFormQuestQpidComponent
];

export * from './exemptions-form-expiry-date/exemptions-form-expiry-date.component';
export * from './exemptions-form-quest-number/exemptions-form-quest-number.component';
export * from './exemptions-form-quest-qpid/exemptions-form-quest-qpid.component';
export * from './exemptions-form-status/exemptions-form-status.component';
export * from './exemptions-form-pending/exemptions-form-pending.component';
