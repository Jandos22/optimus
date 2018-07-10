import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MdcCardModule,
  MdcRippleModule,
  MdcElevationModule
} from '@angular-mdc/web';

const mdcModules: any[] = [MdcCardModule, MdcRippleModule, MdcElevationModule];

@NgModule({
  imports: [CommonModule],
  exports: [...mdcModules],
  declarations: []
})
export class MaterialDesignComponentsModule {}
