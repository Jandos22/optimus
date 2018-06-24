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
  MatSidenavModule,
  MatProgressBarModule,
  MatDialogModule,
  MatChipsModule,
  MatTabsModule,
  MatExpansionModule,
  MatTooltipModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

const matModules: any[] = [
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
  MatSidenavModule,
  MatProgressBarModule,
  MatDialogModule,
  MatChipsModule,
  MatTabsModule,
  MatExpansionModule,
  MatTooltipModule
];

@NgModule({
  imports: [CommonModule, FlexLayoutModule, LayoutModule],
  exports: [FlexLayoutModule, LayoutModule, ...matModules],
  declarations: []
})
export class MaterialModule {}
