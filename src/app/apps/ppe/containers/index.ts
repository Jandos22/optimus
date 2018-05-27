import { PpeCatalogComponent } from './ppe-catalog/ppe-catalog.component';
import { PpeComponent } from './ppe/ppe.component';
import { PpeOrdersComponent } from './ppe-orders/ppe-orders.component';
import { PpeCatalogListComponent } from './ppe-catalog-list/ppe-catalog-list.component';

export const containers: any[] = [
  PpeComponent,
  PpeCatalogComponent,
  PpeCatalogListComponent,
  PpeOrdersComponent
];

export * from './ppe/ppe.component';
export * from './ppe-catalog/ppe-catalog.component';
export * from './ppe-orders/ppe-orders.component';
export * from './ppe-catalog-list/ppe-catalog-list.component';
