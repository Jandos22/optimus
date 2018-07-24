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
    path: 'jobs',
    canActivate: [AuthGuard],
    loadChildren: './apps/jobs/jobs.module#JobsModule'
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
