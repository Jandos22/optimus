// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { reducers, effects } from './store';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// forms
import * as fromForms from './forms';

// services
import * as fromServices from './services';

// routes
export const exemptionsRoutes: Routes = [
  { path: '', component: fromContainers.ExemptionsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(exemptionsRoutes)
  ],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromForms.form_components
  ],
  entryComponents: [...fromForms.form_containers],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    ...fromContainers.containers,
    ...fromComponents.components
  ]
})
export class ExemptionsModule {}
