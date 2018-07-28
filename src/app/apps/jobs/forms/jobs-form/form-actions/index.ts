import { JobsFormActionsNewComponent } from './form-actions-new/jobs-form-actions-new.component';
import { JobsFormActionsComponent } from './jobs-form-actions.component';
import { JobsFormActionsViewComponent } from './form-actions-view/jobs-form-actions-view.component';
import { JobsFormActionsEditComponent } from './form-actions-edit/jobs-form-actions-edit.component';
import { JobsFormActionsEditFieldsComponent } from './form-actions-edit-fields/jobs-form-actions-edit-fields.component';

export const form_actions: any[] = [
  JobsFormActionsNewComponent,
  JobsFormActionsComponent,
  JobsFormActionsViewComponent,
  JobsFormActionsEditComponent,
  JobsFormActionsEditFieldsComponent
];

export * from './form-actions-new/jobs-form-actions-new.component';
export * from './form-actions-new/jobs-form-actions-new.component';
export * from './form-actions-view/jobs-form-actions-view.component';
export * from './form-actions-edit/jobs-form-actions-edit.component';
export * from './form-actions-edit-fields/jobs-form-actions-edit-fields.component';
