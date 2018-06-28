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
import * as fromFormControls from './forms/people-form/form-controls';
import * as fromFormActions from './forms/people-form/form-actions';

// services
import * as fromServices from './services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SimpleNotificationsModule } from 'angular2-notifications';

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
    MaterialModule,
    FontAwesomeModule,
    SimpleNotificationsModule
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromForms.form_dialogs,
    ...fromFormControls.forms_controls,
    ...fromFormActions.form_actions
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class PeopleModule {}
