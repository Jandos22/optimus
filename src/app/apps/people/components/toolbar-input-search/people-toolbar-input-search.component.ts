import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-toolbar-input-search',
  styleUrls: ['people-toolbar-input-search.component.scss'],
  template: `
    <div class="common-toolbar-input-container" [formGroup]="fg_params">
        <input class="common-toolbar-input-search"
            type="text"
            [placeholder]="appName"
            formControlName="query"
            autocomplete="off"
            (focus)="onFocus.emit()" (blur)="onBlur.emit()">
    </div>
    `
})
export class PeopleToolbarInputSearchComponent {
  @Input() appName: string;
  @Input() fg_params: FormGroup;

  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();

  constructor() {}

  clearQuery() {
    this.fg_params.get('query').patchValue('');
  }

  errorMessage() {
    const control = this.fg_params.controls['query'];

    const onlySearchable = control.hasError('onlySearchable');

    return control.dirty
      ? onlySearchable
        ? 'Only letters, numbers and #, -, _ are allowed'
        : ''
      : '';
  }
}
