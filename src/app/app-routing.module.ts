import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: './apps/home/home.module#HomeModule'
  },
  {
    path: 'people',
    canActivate: [AuthGuard],
    loadChildren: './apps/people/people.module#PeopleModule'
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
    path: 'registration',
    loadChildren: './apps/registration/registration.module#RegistrationModule'
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
