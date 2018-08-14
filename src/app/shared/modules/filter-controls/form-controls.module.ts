// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { MaterialModule } from '../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// components
import { FiltersLocationsComponent } from './locations/filters-locations.component';
import { FiltersPeopleSingleComponent } from './people-single/filters-people-single.component';
import { FiltersPeopleSingleFetchComponent } from './people-single/filters-people-single-fetch';
import { FiltersDateRangeComponent } from './date-range/filters-date-range.component';

const components: any[] = [
  FiltersLocationsComponent,
  FiltersPeopleSingleComponent,
  FiltersPeopleSingleFetchComponent,
  FiltersDateRangeComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [...components],
  exports: [...components],
  providers: []
})
export class FilterControlsModule {}
