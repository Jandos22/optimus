import { FormMode } from './../../../../interface/form.model';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Sanitizer,
  SecurityContext,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
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

        <!-- NEW or EDIT modes -->
        <quill-editor
            [hidden]="mode === 'view'"
            [modules]="modules"
            [style]="{height: '200px'}"
            [formControl]="fg_fields.controls['RichText']"
            (onSelectionChanged)="handleSelectionChanged($event)">
        </quill-editor>

        <!-- VIEW mode -->
        <div #richtext [hidden]="mode !== 'view'" class="common-rich-text-view-container">
        </div>
    </div>
    `
})
export class RichTextEditorLightComponent implements OnInit, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  @Output() onFocus = new EventEmitter<any>();

  modules;

  // for view mode
  @ViewChild('richtext') private richtext: ElementRef;

  constructor(private sanitizer: Sanitizer) {}

  ngOnInit() {
    this.initModules();
    console.log(this.mode);

    this.fg_fields.controls['RichText'].statusChanges.subscribe(v => {
      console.log(this.fg_fields.get('RichText'));
    });
  }

  reactOnModeChange(mode: FormMode) {
    if (mode === 'view') {
      this.richtext.nativeElement.innerHTML = this.fg_fields.controls[
        'RichText'
      ].value;
    }
  }

  initModules() {
    this.modules = {
      toolbar: [
        // toggled buttons // 'strike', 'underline'
        ['bold', 'italic', 'underline'],
        // lists
        [{ list: 'ordered' }, { list: 'bullet' }],
        // align left, center or right
        [{ align: [] }],
        [{ font: [] }],
        // text and text background colors
        [{ color: [] }, { background: [] }],
        // remove formatting button
        ['clean'],
        // link, image, video
        ['link'],
        // headings
        [{ header: [1, 2, 3, false] }]
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode) {
      this.reactOnModeChange(changes.mode.currentValue);
    }
  }
}
