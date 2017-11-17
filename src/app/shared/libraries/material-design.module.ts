import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatSelectModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule
  ],
  exports: [
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule
  ],
  declarations: []
})
export class MaterialDesignModule { }
