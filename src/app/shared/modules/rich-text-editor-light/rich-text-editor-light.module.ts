import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';

// modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RichTextEditorLightComponent } from './components/text-editor/rich-text-editor-light.component';

// components

@NgModule({
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, QuillModule],
  declarations: [RichTextEditorLightComponent],
  exports: [RichTextEditorLightComponent],
  providers: []
})
export class RichTextEditorLightModule {}
