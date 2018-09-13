import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../shared/libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// entry components
import { FieldsCreateNewFieldComponent } from './create-new-field/fields-create-new-field.component';

/*
    Fields Module's goal is to
    - add/remove/edit oil/gas fields
    - (later) view all fields and get necessary info
    - (later) view current weather and forecast of fields

    Field Module interact with users via
    - quick dialog box
    - (later) via own Fields AppPage
*/

@NgModule({
  imports: [CommonModule, MaterialModule, FontAwesomeModule],
  exports: [FieldsCreateNewFieldComponent],
  declarations: [FieldsCreateNewFieldComponent],
  providers: [],
  entryComponents: [FieldsCreateNewFieldComponent]
})
export class FieldsModule {}
