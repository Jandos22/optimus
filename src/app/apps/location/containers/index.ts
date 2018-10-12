import { LocationComponent } from './location.component';
import { LocationDashboardComponent } from './dashboard/location-dashboard.component';
import { DashboardExemptionsExpiredComponent } from './notifications/exemptions-expired/dashboard-exemptions-expired.component';
import { DashboardExemptionsPendingComponent } from './notifications/exemptions-pending/dashboard-exemptions-pending.component';
import { DashboardHarcsExpiredComponent } from './notifications/harcs-expired/dashboard-harcs-expired.component';
import { DashboardHarcsPendingComponent } from './notifications/harcs-pending/dashboard-harcs-pending.component';
import { DashboardOrdersExpiredComponent } from './notifications/orders-expired/dashboard-orders-expired.component';
import { DashboardIssuesOpenComponent } from './notifications/issues-open/dashboard-issues-open.component';
import { DashboardFailuresOpenComponent } from './notifications/failures-open/dashboard-failures-open.component';

export const containers: any[] = [
  LocationComponent,
  LocationDashboardComponent,
  DashboardExemptionsExpiredComponent,
  DashboardExemptionsPendingComponent,
  DashboardHarcsExpiredComponent,
  DashboardHarcsPendingComponent,
  DashboardOrdersExpiredComponent,
  DashboardIssuesOpenComponent,
  DashboardFailuresOpenComponent
];

export * from './location.component';
export * from './dashboard/location-dashboard.component';
export * from './notifications/exemptions-expired/dashboard-exemptions-expired.component';
export * from './notifications/exemptions-pending/dashboard-exemptions-pending.component';
export * from './notifications/harcs-expired/dashboard-harcs-expired.component';
export * from './notifications/harcs-pending/dashboard-harcs-pending.component';
export * from './notifications/orders-expired/dashboard-orders-expired.component';
export * from './notifications/issues-open/dashboard-issues-open.component';
export * from './notifications/failures-open/dashboard-failures-open.component';
