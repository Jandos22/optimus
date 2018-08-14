import { OrdersLineItemComponent } from './orders-line-item/orders-line-item.component';
import { OrdersListItemComponent } from './orders-list-item/orders-list-item.component';
import { OrdersRequestorComponent } from './orders-requestor/orders-requestor.component';

export const components: any[] = [
  OrdersListItemComponent,
  OrdersRequestorComponent,
  OrdersLineItemComponent
];

export * from './orders-list-item/orders-list-item.component';
export * from './orders-requestor/orders-requestor.component';
export * from './orders-line-item/orders-line-item.component';
