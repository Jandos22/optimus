import { KaizenFormActionsNewComponent } from './form-actions-new/kaizen-form-actions-new.component';
import { KaizenFormActionsComponent } from './kaizen-form-actions.component';
import { KaizenFormActionsViewComponent } from './form-actions-view/kaizen-form-actions-view.component';
import { KaizenFormActionsEditComponent } from './form-actions-edit/kaizen-form-actions-edit.component';
import { KaizenFormActionsEditFieldsComponent } from './form-actions-edit-fields/kaizen-form-actions-edit-fields.component';

export const form_actions: any[] = [
  KaizenFormActionsNewComponent,
  KaizenFormActionsComponent,
  KaizenFormActionsViewComponent,
  KaizenFormActionsEditComponent,
  KaizenFormActionsEditFieldsComponent
];

export * from './form-actions-new/kaizen-form-actions-new.component';
export * from './form-actions-new/kaizen-form-actions-new.component';
export * from './form-actions-view/kaizen-form-actions-view.component';
export * from './form-actions-edit/kaizen-form-actions-edit.component';
export * from './form-actions-edit-fields/kaizen-form-actions-edit-fields.component';
