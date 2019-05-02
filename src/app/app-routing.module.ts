import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'timeline',
    canActivate: [AuthGuard],
    loadChildren: './apps/timeline/timeline.module#TimelineModule'
  },
  {
    path: 'people',
    canActivate: [AuthGuard],
    loadChildren: './apps/people/people.module#PeopleModule'
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: './apps/orders/orders.module#OrdersModule'
  },
  {
    path: 'jobs',
    canActivate: [AuthGuard],
    loadChildren: './apps/jobs/jobs.module#JobsModule'
  },
  {
    path: 'appraisals',
    canActivate: [AuthGuard],
    loadChildren: './apps/appraisals/appraisals.module#AppraisalsModule'
  },
  {
    path: 'kaizen',
    canActivate: [AuthGuard],
    loadChildren: './apps/kaizen/kaizen.module#KaizenModule'
  },
  {
    path: 'ppe',
    canActivate: [AuthGuard],
    loadChildren: './apps/ppe/ppe.module#PpeModule'
  },
  {
    path: 'exemptions',
    canActivate: [AuthGuard],
    loadChildren: './apps/exemptions/exemptions.module#ExemptionsModule'
  },
  {
    path: 'harcs',
    canActivate: [AuthGuard],
    loadChildren: './apps/harcs/harcs.module#HarcsModule'
  },  
  {
    path: 'batteries',
    canActivate: [AuthGuard],
    loadChildren: './apps/batteries/batteries.module#BatteriesModule'
  },
  {
    path: 'registration',
    canActivate: [AuthGuard],
    loadChildren: './apps/registration/registration.module#RegistrationModule'
  },
  { path: '', redirectTo: 'timeline', pathMatch: 'full' }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
