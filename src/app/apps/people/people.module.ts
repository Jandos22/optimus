import { ImageCropperModule } from 'ng2-img-cropper/src/imageCropperModule';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../libraries/material.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// services
import * as fromServices from './services';

// routes
export const peopleRoutes: Routes = [
  { path: '', component: fromContainers.PeopleComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(peopleRoutes),
    StoreModule.forFeature('people', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    ImageCropperModule
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    ...fromContainers.containers,
    ...fromComponents.components
  ]
})
export class PeopleModule {}
