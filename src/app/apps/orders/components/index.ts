import { OrdersLineItemComponent } from './orders-line-item/orders-line-item.component';
import { OrdersListItemComponent } from './orders-list-item/orders-list-item.component';
import { OrdersRequestorComponent } from './orders-requestor/orders-requestor.component';
import { OrdersLastUpdatedComponent } from './orders-last-updated/orders-last-updated.component';
import { OrdersLinksComponent } from './orders-links/orders-links.component';

export const components: any[] = [
  OrdersListItemComponent,
  OrdersRequestorComponent,
  OrdersLineItemComponent,
  OrdersLastUpdatedComponent,
  OrdersLinksComponent
];

export * from './orders-list-item/orders-list-item.component';
export * from './orders-requestor/orders-requestor.component';
export * from './orders-line-item/orders-line-item.component';
export * from './orders-last-updated/orders-last-updated.component';
export * from './orders-links/orders-links.component';
