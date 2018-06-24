// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

// 3rd party
import { MaterialModule } from '../../shared/libraries/material.module';
import { MaterialDesignComponentsModule } from '../../shared/libraries/material-design-components.module';
import { ImageCropperModule } from 'ngx-img-cropper';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// services
import * as fromServices from './services';

// routes
export const timelineRoutes: Routes = [
  { path: '', component: fromContainers.TimelineComponent }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(timelineRoutes),
    StoreModule.forFeature('timeline', reducers),
    EffectsModule.forFeature(effects),
    ImageCropperModule,
    MaterialModule,
    MaterialDesignComponentsModule
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components]
})
export class TimelineModule {}
