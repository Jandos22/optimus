import { FormMode } from './../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-title',
  styleUrls: ['form-control-title.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <textarea matInput
        placeholder="Title"
        formControlName="Title"
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        cdkAutosizeMaxRows="1"
        cdkAutosizeMaxRows="2">
      </textarea>
      <mat-hint align="end" *ngIf="mode !== 'view'">{{fg_fields.get('Title').value.length}} / 70</mat-hint>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class FormControlTitleComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('Title').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['Title'];

    const required = control.hasError('required');
    const min = control.hasError('minlength');
    const max = control.hasError('maxlength');

    return this.fg_fields.get('Summary').touched
      ? required
        ? '... is required'
        : min
          ? 'minimum 30 characters required'
          : max
            ? 'maximum 70 characters allowed'
            : ''
      : '';
  }
}
