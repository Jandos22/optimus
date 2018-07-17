import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules used
import { MaterialModule } from './../../../../shared/libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { MaterialDesignComponentsModule } from '../../../../shared/libraries/material-design-components.module';

// components
import { HarcsStatusCheckComponent } from './container/harcs-status-check.component';
import { HarcsService } from '../../services';

@NgModule({
  imports: [
    CommonModule, // for directives
    FontAwesomeModule, // for its icons
    MaterialModule // for its buttons
    // MaterialDesignComponentsModule // for its ripple
  ],
  declarations: [HarcsStatusCheckComponent],
  exports: [HarcsStatusCheckComponent],
  providers: [HarcsService]
})
export class HarcsStatusCheckModule {}
