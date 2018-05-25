import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdcCardModule, MdcRippleModule } from '@angular-mdc/web';

const mdcModules: any[] = [MdcCardModule, MdcRippleModule];

@NgModule({
  imports: [CommonModule],
  exports: [...mdcModules],
  declarations: []
})
export class MaterialDesignComponentsModule {}
