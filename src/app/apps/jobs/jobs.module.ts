// my shared modules
import { SharedModule } from '../../shared/shared.module';

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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// forms
import * as fromForms from './forms'; // must go in entry components
import * as fromJobsFormControls from './forms/jobs-form/form-controls';
import * as fromJobsFormActions from './forms/jobs-form/form-actions';

// services
import * as fromServices from './services';

// pipes
import * as fromPipes from '../../shared/pipes';

// form modules
import { ToolbarButtonsModule } from '../../shared/modules/toolbar-buttons/toolbar-buttons.module';
import { FormControlsModule } from '../../shared/modules/form-controls/form-controls.module';

// routes
export const jobsRoutes: Routes = [
  { path: '', component: fromContainers.JobsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(jobsRoutes),
    StoreModule.forFeature('jobs', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    FontAwesomeModule,
    // form control modules
    FormControlsModule,
    // toolbar modules
    ToolbarButtonsModule
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromForms.form_dialogs,
    ...fromJobsFormControls.forms_controls,
    ...fromJobsFormActions.form_actions
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class JobsModule {}
