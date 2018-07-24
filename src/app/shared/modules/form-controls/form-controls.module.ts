// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { FormControlLocationsComponent } from './locations/form-control-locations.component';
import { FormControlLocationComponent } from './location/form-control-location.component';
import { FormControlHashTagsComponent } from './hash-tags/form-control-hash-tags.component';

import { FormControlUserSelectionComponent } from './user-selection/container/form-control-user-selection.component';
import { UserSelectionUserOptionComponent } from './user-selection/option/user-selection-user-option.component';
import { UserSelectionUserSelectedComponent } from './user-selection/selected/user-selection-user-selected.component';

import { FormControlTitleComponent } from './title/form-control-title.component';
import { FormControlSummaryComponent } from './summary/form-control-summary.component';
import { FormControlQuestRirComponent } from './quest-rir/form-control-quest-rir.component';
import { FormControlQuestQpidComponent } from './quest-qpid/form-control-quest-qpid.component';
import { FormControlDateTimeComponent } from './date-time-picker/form-control-date-time.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    FormControlTitleComponent,
    FormControlSummaryComponent,
    FormControlLocationsComponent,
    FormControlLocationComponent,
    FormControlHashTagsComponent,
    FormControlUserSelectionComponent,
    UserSelectionUserOptionComponent,
    UserSelectionUserSelectedComponent,
    FormControlQuestRirComponent,
    FormControlQuestQpidComponent,
    FormControlDateTimeComponent
  ],
  exports: [
    FormControlTitleComponent,
    FormControlSummaryComponent,
    FormControlLocationsComponent,
    FormControlLocationComponent,
    FormControlHashTagsComponent,
    FormControlUserSelectionComponent,
    UserSelectionUserOptionComponent,
    UserSelectionUserSelectedComponent,
    FormControlQuestRirComponent,
    FormControlQuestQpidComponent,
    FormControlDateTimeComponent
  ],
  providers: []
})
export class FormControlsModule {}
