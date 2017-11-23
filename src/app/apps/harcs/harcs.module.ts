import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/harcs.reducer';
import { HarcsEffects } from './store/harcs.effects';

import { MaterialDesignModule } from './../../shared/libraries/material-design.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HarcsComponent } from './harcs.component';
import { HarcsToolbarComponent } from './harcs-toolbar/harcs-toolbar.component';

export const harcsRoutes: Routes = [
  { path: '', component: HarcsComponent},
];

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    ReactiveFormsModule,
    RouterModule.forChild(harcsRoutes),
    StoreModule.forFeature('harcs', reducer),
    EffectsModule.forFeature([HarcsEffects])
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [HarcsComponent, HarcsToolbarComponent]
})
export class HarcsModule { }
