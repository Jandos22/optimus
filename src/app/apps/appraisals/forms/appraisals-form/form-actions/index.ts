import { AppraisalsFormActionsComponent } from './appraisals-form-actions.component';
import { AppraisalsFormActionsViewComponent } from './view/appraisals-form-actions-view.component';
import { AppraisalsFormActionsNewComponent } from './new/appraisals-form-actions-new.component';
import { AppraisalsFormActionsEditComponent } from './edit/appraisals-form-actions-edit.component';
import { AppraisalsFormActionsEditFieldsComponent } from './edit/appraisals-form-actions-edit-fields.component';

export const form_actions: any[] = [
  AppraisalsFormActionsNewComponent,
  AppraisalsFormActionsComponent,
  AppraisalsFormActionsViewComponent,
  AppraisalsFormActionsEditComponent,
  AppraisalsFormActionsEditFieldsComponent
];

export * from './appraisals-form-actions.component';
export * from './view/appraisals-form-actions-view.component';
export * from './new/appraisals-form-actions-new.component';
export * from './edit/appraisals-form-actions-edit.component';
export * from './edit/appraisals-form-actions-edit-fields.component';
