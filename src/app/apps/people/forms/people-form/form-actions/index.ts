import { PeopleFormActionsComponent } from './people-form-actions.component';
import { PeopleFormActionsEditComponent } from './form-actions-edit/people-form-actions-edit.component';
import { PeopleFormWhenNewButtonsComponent } from './when-new-buttons/people-form-when-new-buttons.component';
import { PeopleFormActionsViewComponent } from './form-actions-view/people-form-actions-view.component';
import { PeopleFormActionsEditFieldsComponent } from './form-actions-edit-fields/people-form-actions-edit-fields.component';

export const form_actions: any[] = [
  PeopleFormActionsComponent,
  PeopleFormActionsViewComponent,
  PeopleFormActionsEditComponent,
  PeopleFormActionsEditFieldsComponent,
  PeopleFormWhenNewButtonsComponent
];

export * from './people-form-actions.component';
export * from './form-actions-edit/people-form-actions-edit.component';
export * from './form-actions-view/people-form-actions-view.component';
export * from './when-new-buttons/people-form-when-new-buttons.component';
export * from './form-actions-edit-fields/people-form-actions-edit-fields.component';
