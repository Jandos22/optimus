import { NgModule } from '@angular/core';

// modules
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../libraries/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlHashTagsComponent } from './components/hash-tags/form-control-hash-tags.component';

// components

@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  declarations: [FormControlHashTagsComponent],
  exports: [FormControlHashTagsComponent],
  providers: []
})
export class FormControlHashTagsModule {}
