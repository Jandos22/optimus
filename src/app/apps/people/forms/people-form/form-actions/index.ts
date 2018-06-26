import { PeopleFormActionsComponent } from './people-form-actions.component';
import { PeopleFormActionsViewComponent } from './form-actions-view/people-form-actions-view.component';
import { PeopleFormActionsNewComponent } from './form-actions-new/people-form-actions-new.component';
import { PeopleFormActionsEditComponent } from './form-actions-edit/people-form-actions-edit.component';
import { PeopleFormActionsEditFieldsComponent } from './form-actions-edit-fields/people-form-actions-edit-fields.component';

export const form_actions: any[] = [
  PeopleFormActionsComponent,
  PeopleFormActionsViewComponent,
  PeopleFormActionsNewComponent,
  PeopleFormActionsEditComponent,
  PeopleFormActionsEditFieldsComponent
];

export * from './people-form-actions.component';
export * from './form-actions-view/people-form-actions-view.component';
export * from './form-actions-new/people-form-actions-new.component';
export * from './form-actions-edit/people-form-actions-edit.component';
export * from './form-actions-edit-fields/people-form-actions-edit-fields.component';
