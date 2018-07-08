import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// import { QuillEditorComponent } from 'ngx-quill';

import Quill from 'quill';

// add image resize module
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-rich-text-editor-light',
  styleUrls: ['rich-text-editor-light.component.scss'],
  template: `
    <div [formGroup]="fg_fields">
        <quill-editor
            [modules]="modules"
            [style]="{height: '200px'}"
            formControlName="RichText"
            (onSelectionChanged)="handleSelectionChanged($event)">
        </quill-editor>
    </div>
    <div class="image-warning-text">* add image(s) only if absolutely needed</div>
    <div class="image-warning-text">** limit image's width to 400px</div>
    `
})
export class RichTextEditorLightComponent implements OnInit {
  @Input() fg_fields: FormGroup;

  @Output() onFocus = new EventEmitter<any>();

  modules;

  constructor() {}

  ngOnInit() {
    this.initModules();

    this.fg_fields.get('RichText').statusChanges.subscribe(v => {
      console.log(this.fg_fields.get('RichText'));
    });
  }

  initModules() {
    this.modules = {
      toolbar: [
        // align left, center or right
        [{ align: [] }],
        // toggled buttons
        ['bold', 'italic', 'underline', 'strike'],
        // custom button values
        // [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
        // lists
        [{ list: 'ordered' }, { list: 'bullet' }],
        // headings
        [{ header: [1, 2, 3, false] }],
        // text and text background colors
        [{ color: [] }, { background: [] }],
        // remove formatting button
        ['clean'],
        // link and image, video
        ['link', 'image']
      ],
      imageResize: {}
    };
  }

  handleSelectionChanged(data) {
    if (data.range) {
      this.onFocus.emit(true);
    } else {
      this.onFocus.emit(false);
    }
  }
}
