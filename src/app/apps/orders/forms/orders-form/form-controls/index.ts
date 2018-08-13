import { OrdersFormOrderDateComponent } from './order-date/orders-form-order-date.component';
import { OrdersFormOrderNameComponent } from './order-name/orders-form-order-name.component';
import { OrdersFormLineItemComponent } from './line-item/orders-form-line-item.component';
import { OrdersFormLnPartNumberComponent } from './ln-part-number/orders-form-ln-part-number.component';
import { OrdersFormLnQuantityComponent } from './ln-quantity/orders-form-ln-quantity.component';
import { OrdersFormLnTitleComponent } from './ln-title/orders-form-ln-title.component';
import { OrdersFormLnOrderNumberComponent } from './ln-order-number/orders-form-ln-order-number.component';
import { OrdersFormLnCommentsComponent } from './ln-comments/orders-form-ln-comments.component';
import { OrdersFormLnOrderStatusComponent } from './ln-order-status/orders-form-ln-order-status.component';
import { OrdersFormAddLineItemComponent } from './add-line-item/orders-form-add-line-item.component';
import { OrdersFormRemoveLineItemComponent } from './remove-line-item/orders-form-add-line-item.component';
import { OrdersFormLineItemDynamicValidationComponent } from './dynamic-validation/orders-form-line-items-dynvalid.component';

export const forms_controls: any[] = [
  OrdersFormOrderDateComponent,
  OrdersFormOrderNameComponent,
  OrdersFormLineItemComponent,
  OrdersFormLnPartNumberComponent,
  OrdersFormLnQuantityComponent,
  OrdersFormLnTitleComponent,
  OrdersFormLnOrderNumberComponent,
  OrdersFormLnCommentsComponent,
  OrdersFormLnOrderStatusComponent,
  OrdersFormAddLineItemComponent,
  OrdersFormRemoveLineItemComponent,
  OrdersFormLineItemDynamicValidationComponent
];

export * from './order-date/orders-form-order-date.component';
export * from './order-name/orders-form-order-name.component';
export * from './line-item/orders-form-line-item.component';
export * from './ln-part-number/orders-form-ln-part-number.component';
export * from './ln-quantity/orders-form-ln-quantity.component';
export * from './ln-title/orders-form-ln-title.component';
export * from './ln-order-number/orders-form-ln-order-number.component';
export * from './ln-comments/orders-form-ln-comments.component';
export * from './ln-order-status/orders-form-ln-order-status.component';
export * from './add-line-item/orders-form-add-line-item.component';
export * from './remove-line-item/orders-form-add-line-item.component';
export * from './dynamic-validation/orders-form-line-items-dynvalid.component';
