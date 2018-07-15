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
import { MaterialDesignComponentsModule } from '../../shared/libraries/material-design-components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SimpleNotificationsModule } from 'angular2-notifications';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// forms
import * as fromForms from './forms'; // must go in entry components
import * as fromFormControls from './forms/exemptions-form/form-controls';
import * as fromFormActions from './forms/exemptions-form/form-actions';

// services
import * as fromServices from './services';

// form modules
import { ToolbarButtonsModule } from '../../shared/modules/toolbar-buttons/toolbar-buttons.module';
import { FormControlsModule } from '../../shared/modules/form-controls/form-controls.module';

// routes
export const exemptionsRoutes: Routes = [
  { path: '', component: fromContainers.ExemptionsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(exemptionsRoutes),
    StoreModule.forFeature('exemptions', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    MaterialDesignComponentsModule,
    FontAwesomeModule,
    SimpleNotificationsModule,
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
    ...fromFormControls.forms_controls,
    ...fromFormActions.form_actions
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class ExemptionsModule {}
