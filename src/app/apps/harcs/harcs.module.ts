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

// filters
import * as fromFilters from './containers/harcs-filters/content';

// forms
import * as fromForms from './forms'; // must go in entry components
import * as fromFormControls from './forms/harcs-form/form-controls';
import * as fromFormActions from './forms/harcs-form/form-actions';

// services
import * as fromServices from './services';

// form modules
import { ToolbarButtonsModule } from '../../shared/modules/toolbar-buttons/toolbar-buttons.module';
import { FormControlsModule } from '../../shared/modules/form-controls/form-controls.module';
import { FilterControlsModule } from '../../shared/modules/filter-controls/locations/form-controls.module';

// routes
export const harcsRoutes: Routes = [
  { path: '', component: fromContainers.HarcsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(harcsRoutes),
    StoreModule.forFeature('harcs', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    MaterialDesignComponentsModule,
    FontAwesomeModule,
    SimpleNotificationsModule,
    // form control modules
    FormControlsModule,
    FilterControlsModule,
    // toolbar modules
    ToolbarButtonsModule
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromFilters.filters,
    ...fromForms.form_dialogs,
    ...fromFormControls.forms_controls,
    ...fromFormActions.form_actions
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class HarcsModule {}
