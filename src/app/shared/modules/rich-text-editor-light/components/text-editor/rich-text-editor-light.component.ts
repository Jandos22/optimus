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
  ViewChild
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
          *ngIf="mode !== 'view'"
            [modules]="modules"
            [style]="{height: '200px'}"
            formControlName="RichText"
            (onSelectionChanged)="handleSelectionChanged($event)">
        </quill-editor>

        <!-- VIEW mode -->
        <div #richtext>
        </div>
    </div>
    `
})
export class RichTextEditorLightComponent implements OnInit {
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

    this.fg_fields.get('RichText').statusChanges.subscribe(v => {
      console.log(this.fg_fields.get('RichText'));
    });

    // this.richtext = this.sanitizer.sanitize(
    //   SecurityContext.NONE,
    //   this.fg_fields.get('RichText').value
    // );

    this.richtext.nativeElement.innerHTML = this.fg_fields.get(
      'RichText'
    ).value;
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
}
