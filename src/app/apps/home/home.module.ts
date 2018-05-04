import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';

export const homeRoutes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
  declarations: [HomeComponent]
})
export class HomeModule {}
