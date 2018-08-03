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
import { ImageCropperModule } from 'ngx-img-cropper';
import { SimpleNotificationsModule } from 'angular2-notifications';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponents from './components';

// filters
import * as fromFilters from './containers/timeline-filters/content';

// forms
import * as fromForms from './forms'; // must go in entry components
import * as fromFormControls from './forms/timeline-form/form-controls';
import * as fromFormActions from './forms/timeline-form/form-actions';

// services
import * as fromServices from './services';

// pipes
import * as fromPipes from '../../shared/pipes';

// form modules
import { FormControlsModule } from './../../shared/modules/form-controls/form-controls.module';
import { RichTextEditorLightModule } from '../../shared/modules/rich-text-editor-light/rich-text-editor-light.module';
import { FormControlImagePickerModule } from './../../shared/modules/form-control-image-picker/form-control-image-picker.module';
import { ToolbarButtonsModule } from '../../shared/modules/toolbar-buttons/toolbar-buttons.module';

// routes
export const timelineRoutes: Routes = [
  { path: '', component: fromContainers.TimelineComponent }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(timelineRoutes),
    StoreModule.forFeature('timeline', reducers),
    EffectsModule.forFeature(effects),
    MaterialModule,
    MaterialDesignComponentsModule,
    FontAwesomeModule,
    SimpleNotificationsModule,
    // form control modules
    FormControlsModule,
    ToolbarButtonsModule,
    RichTextEditorLightModule,
    FormControlImagePickerModule
  ],
  providers: [...fromServices.services],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components,
    ...fromFilters.filters,
    ...fromForms.form_dialogs,
    ...fromFormControls.forms_controls,
    ...fromFormActions.form_actions
    // ...fromPipes.pipes
  ],
  entryComponents: [...fromForms.form_dialogs]
})
export class TimelineModule {}
