// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ui components
import { MaterialModule } from '../../shared/libraries/material.module';
import { MaterialDesignComponentsModule } from '../../shared/libraries/material-design-components.module';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// forms
// import * as fromForms from './forms';
import { PpeService } from './services/ppe.service';

// routes
export const ppeRoutes: Routes = [
  {
    path: '',
    component: fromContainers.PpeComponent,
    children: [
      { path: 'catalog', component: fromContainers.PpeCatalogComponent },
      { path: 'orders', component: fromContainers.PpeOrdersComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ppeRoutes),
    StoreModule.forFeature('ppe', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    MaterialDesignComponentsModule
  ],
  providers: [PpeService],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components
    // ...fromForms.form_components
  ],
  entryComponents: [],
  exports: [
    // RouterModule,
    // ReactiveFormsModule,
    // ...fromContainers.containers
    // ...fromComponents.components
  ]
})
export class PpeModule {}
