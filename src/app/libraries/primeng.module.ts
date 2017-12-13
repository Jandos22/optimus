import {
  MenuModule,
  ButtonModule,
  SplitButtonModule,
  RadioButtonModule,
  CheckboxModule,
  InputTextModule,
  MenubarModule,
  DropdownModule
  } from 'primeng/primeng';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    MenuModule,
    ButtonModule,
    RadioButtonModule,
    SplitButtonModule,
    CheckboxModule,
    InputTextModule,
    MenubarModule,
    DropdownModule
  ]
})
export class PrimengModule { }
