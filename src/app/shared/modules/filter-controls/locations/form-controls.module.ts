// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared.module';
import { MaterialModule } from '../../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { FiltersLocationsComponent } from './filters-locations.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [FiltersLocationsComponent],
  exports: [FiltersLocationsComponent],
  providers: []
})
export class FilterControlsModule {}
