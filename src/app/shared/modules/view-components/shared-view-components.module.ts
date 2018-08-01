import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import * as view from './shared-view-components';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [...view.components],
  exports: [...view.components],
  providers: []
})
export class SharedViewComponentsModule {}
