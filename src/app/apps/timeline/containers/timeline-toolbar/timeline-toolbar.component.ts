import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timeline-toolbar',
  styleUrls: ['timeline-toolbar.component.scss'],
  template: `
    <app-timeline-toolbar-button-menu class="common-toolbar-item">
    </app-timeline-toolbar-button-menu>

    <app-timeline-toolbar-input-search fxFlex
        [appName]="appName" [fg_params]="fg_params"
        (onFocus)="onFocus.emit()" (onBlur)="onBlur.emit()">
    </app-timeline-toolbar-input-search>

    <app-timeline-toolbar-button-clear
        *ngIf="fg_params.get('query').value"
        [fg_params]="fg_params">
    </app-timeline-toolbar-button-clear>

    <app-timeline-toolbar-button-filters>
    </app-timeline-toolbar-button-filters>

    <app-timeline-toolbar-button-add>
    </app-timeline-toolbar-button-add>
    `
})
export class TimelineToolbarComponent {
  @Input() appName: string;
  @Input() fg_params: FormGroup;

  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();

  constructor() {}

  onClear() {
    this.fg_params.reset();
  }
}
