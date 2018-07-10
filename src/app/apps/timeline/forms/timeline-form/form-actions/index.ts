import { TimelineFormActionsNewComponent } from './form-actions-new/timeline-form-actions-new.component';
import { TimelineFormActionsComponent } from './timeline-form-actions.component';
import { TimelineFormActionsViewComponent } from './form-actions-view/timeline-form-actions-view.component';
import { TimelineFormActionsEditComponent } from './form-actions-edit/timeline-form-actions-edit.component';
import { TimelineFormActionsEditFieldsComponent } from './form-actions-edit-fields/timeline-form-actions-edit-fields.component';

export const form_actions: any[] = [
  TimelineFormActionsNewComponent,
  TimelineFormActionsComponent,
  TimelineFormActionsViewComponent,
  TimelineFormActionsEditComponent,
  TimelineFormActionsEditFieldsComponent
];

export * from './form-actions-new/timeline-form-actions-new.component';
export * from './form-actions-new/timeline-form-actions-new.component';
export * from './form-actions-view/timeline-form-actions-view.component';
export * from './form-actions-edit/timeline-form-actions-edit.component';
export * from './form-actions-edit-fields/timeline-form-actions-edit-fields.component';
