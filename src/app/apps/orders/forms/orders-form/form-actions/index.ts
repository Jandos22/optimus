import { OrdersFormActionsNewComponent } from './form-actions-new/orders-form-actions-new.component';
import { OrdersFormActionsComponent } from './orders-form-actions.component';
import { OrdersFormActionsViewComponent } from './form-actions-view/orders-form-actions-view.component';
import { OrdersFormActionsEditComponent } from './form-actions-edit/orders-form-actions-edit.component';
import { OrdersFormActionsEditFieldsComponent } from './form-actions-edit-fields/orders-form-actions-edit-fields.component';

export const form_actions: any[] = [
  OrdersFormActionsNewComponent,
  OrdersFormActionsComponent,
  OrdersFormActionsViewComponent,
  OrdersFormActionsEditComponent,
  OrdersFormActionsEditFieldsComponent
];

export * from './form-actions-new/orders-form-actions-new.component';
export * from './form-actions-new/orders-form-actions-new.component';
export * from './form-actions-view/orders-form-actions-view.component';
export * from './form-actions-edit/orders-form-actions-edit.component';
export * from './form-actions-edit-fields/orders-form-actions-edit-fields.component';
