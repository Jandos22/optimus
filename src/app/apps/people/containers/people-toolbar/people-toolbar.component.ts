import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.scss'],
  template: `
    <app-people-toolbar-button-menu class="common-toolbar-item">
    </app-people-toolbar-button-menu>

    <app-people-toolbar-input-search fxFlex
        [appName]="appName" [fg_params]="fg_params"
        (onFocus)="onFocus.emit()" (onBlur)="onBlur.emit()">
    </app-people-toolbar-input-search>

    <app-people-toolbar-button-clear
        *ngIf="fg_params.get('query').value"
        [fg_params]="fg_params">
    </app-people-toolbar-button-clear>

    <app-people-toolbar-button-filters>
    </app-people-toolbar-button-filters>

    <app-people-toolbar-button-add>
    </app-people-toolbar-button-add>
    `
})
export class PeopleToolbarComponent {
  @Input() appName: string;
  @Input() fg_params: FormGroup;

  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();

  constructor() {}

  onClear() {
    this.fg_params.reset();
  }
}
