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
  MatInputModule,
  MatListModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatSidenavModule
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
    MatListModule,
    MatCardModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatSidenavModule
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
    MatListModule,
    MatCardModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatSidenavModule
  ],
  declarations: []
})
export class MaterialDesignModule { }
