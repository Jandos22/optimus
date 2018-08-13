import { OrdersComponent } from './orders/orders.component';
import { OrdersHeaderComponent } from './orders-header/orders-header.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersFooterComponent } from './orders-footer/orders-footer.component';
import { OrdersToolbarComponent } from './orders-toolbar/orders-toolbar.component';
import { OrdersFiltersComponent } from './orders-filters/orders-filters.component';
import { OrdersFiltersHeaderComponent } from './orders-filters/header/orders-filters-header.component';
import { OrdersFiltersContentComponent } from './orders-filters/content/orders-filters-content.component';
import { OrdersFiltersFooterComponent } from './orders-filters/footer/orders-filters-footer.component';

export const containers: any[] = [
  OrdersComponent,
  OrdersHeaderComponent,
  OrdersToolbarComponent,
  OrdersListComponent,
  OrdersFooterComponent,
  OrdersFiltersComponent,
  OrdersFiltersHeaderComponent,
  OrdersFiltersContentComponent,
  OrdersFiltersFooterComponent
];

export * from './orders/orders.component';
export * from './orders-header/orders-header.component';
export * from './orders-toolbar/orders-toolbar.component';
export * from './orders-list/orders-list.component';
export * from './orders-footer/orders-footer.component';
export * from './orders-filters/orders-filters.component';
export * from './orders-filters/header/orders-filters-header.component';
export * from './orders-filters/content/orders-filters-content.component';
export * from './orders-filters/footer/orders-filters-footer.component';
