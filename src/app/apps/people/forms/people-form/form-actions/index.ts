import { PeopleFormActionsComponent } from './form-actions/people-form-actions.component';
import { PeopleFormActionsEditComponent } from './form-actions-edit/people-form-actions-edit.component';
import { PeopleFormWhenNewButtonsComponent } from './when-new-buttons/people-form-when-new-buttons.component';
import { PeopleFormWhenViewButtonsComponent } from './when-view-buttons/people-form-when-view-buttons.component';
import { PeopleFormActionsEditFieldsComponent } from './form-actions-edit-fields/people-form-actions-edit-fields.component';

export const form_actions: any[] = [
  PeopleFormActionsComponent,
  PeopleFormWhenViewButtonsComponent,
  PeopleFormActionsEditComponent,
  PeopleFormActionsEditFieldsComponent,
  PeopleFormWhenNewButtonsComponent
];

export * from './form-actions/people-form-actions.component';
export * from './form-actions-edit/people-form-actions-edit.component';
export * from './when-view-buttons/people-form-when-view-buttons.component';
export * from './when-new-buttons/people-form-when-new-buttons.component';
export * from './form-actions-edit-fields/people-form-actions-edit-fields.component';
