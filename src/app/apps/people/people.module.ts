// 3rd party
import { MaterialModule } from '../../shared/libraries/material.module';
import { ImageCropperModule } from 'ngx-img-cropper';

// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// forms
import * as fromForms from './forms';

// form components
import * as fromFormComponents from './forms/people-form';

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
    ImageCropperModule,
    MaterialModule
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromForms.forms,
    ...fromFormComponents.forms_components
  ],
  entryComponents: [...fromForms.forms],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    ...fromContainers.containers,
    ...fromComponents.components
  ]
})
export class PeopleModule {}
