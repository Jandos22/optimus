import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../shared/libraries/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// common imports
import * as fromComponents from './components';
import * as fromContainers from './containers';
import * as fromServices from './services';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MaterialModule, FontAwesomeModule],
  exports: [...fromComponents.components, ...fromContainers.containers],
  declarations: [...fromComponents.components, ...fromContainers.containers],
  providers: [...fromServices.services]
})
export class LocationModule {}
