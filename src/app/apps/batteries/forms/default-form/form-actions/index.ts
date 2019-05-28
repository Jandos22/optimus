import { BatteriesFormActionsNewComponent } from "./form-actions-new/batteries-form-actions-new.component";
import { BatteriesFormActionsComponent } from "./batteries-form-actions.component";
import { BatteriesFormActionsViewComponent } from "./form-actions-view/batteries-form-actions-view.component";
import { BatteriesFormActionsEditComponent } from "./form-actions-edit/batteries-form-actions-edit.component";
import { BatteriesFormActionsEditFieldsComponent } from "./form-actions-edit-fields/batteries-form-actions-edit-fields.component";

export const form_actions: any[] = [
  BatteriesFormActionsNewComponent,
  BatteriesFormActionsComponent,
  BatteriesFormActionsViewComponent,
  BatteriesFormActionsEditComponent,
  BatteriesFormActionsEditFieldsComponent
];

export * from "./form-actions-new/batteries-form-actions-new.component";
export * from "./form-actions-new/batteries-form-actions-new.component";
export * from "./form-actions-view/batteries-form-actions-view.component";
export * from "./form-actions-edit/batteries-form-actions-edit.component";
export * from "./form-actions-edit-fields/batteries-form-actions-edit-fields.component";
