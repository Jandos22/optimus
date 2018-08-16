import { OrdersFiltersPartNumberComponent } from './part-number/orders-filters-part-number.component';
import { OrdersFiltersOrderStatusComponent } from './order-status/orders-filters-order-status.component';
import { OrdersFiltersLastUpdateComponent } from './last-update/orders-filters-last-update.component';
import { OrdersFiltersOrderNumberComponent } from './order-number/orders-filters-order-number.component';

export const filters: any[] = [
  OrdersFiltersPartNumberComponent,
  OrdersFiltersOrderStatusComponent,
  OrdersFiltersLastUpdateComponent,
  OrdersFiltersOrderNumberComponent
];

export * from './part-number/orders-filters-part-number.component';
export * from './order-status/orders-filters-order-status.component';
export * from './last-update/orders-filters-last-update.component';
export * from './order-number/orders-filters-order-number.component';
