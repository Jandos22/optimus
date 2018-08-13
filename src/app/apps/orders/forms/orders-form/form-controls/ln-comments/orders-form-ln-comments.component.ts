import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-orders-form-ln-comments',
  styleUrls: ['orders-form-ln-comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields"
      floatLabel="never">

      <textarea matInput
        placeholder="Comments"
        [formControlName]="fieldName"
        cdkTextareaAutosize
        #autosize="cdkTextareaAutosize"
        cdkAutosizeMinRows="1"
        cdkAutosizeMaxRows="3">
      </textarea>

    </mat-form-field>
  `
})
export class OrdersFormLnCommentsComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;
  @Input() fieldName: string;
  @Input() displayName: string;

  constructor() {}

  get hasError() {
    return this.fg_fields.controls[this.fieldName].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls[this.fieldName];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return control.touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 255 characters allowed'
          : ''
      : '';
  }
}
