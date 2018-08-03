import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-appraisals-form-operator-comments',
  styleUrls: ['appraisals-form-operator-comments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
        <textarea matInput
          placeholder="Operator Comments"
          formControlName="OperatorComments"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          cdkAutosizeMinRows="1"
          cdkAutosizeMaxRows="4">
        </textarea>
        <mat-hint align="end" *ngIf="mode !== 'view' && !isEmpty">
          {{fg_fields.get('OperatorComments').value?.length }} / 255
        </mat-hint>
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class AppraisalsFormOperatorCommentsComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get isEmpty() {
    const value = this.fg_fields.get('OperatorComments').value;
    return value ? false : true;
  }

  get hasError() {
    return this.fg_fields.get('OperatorComments').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['OperatorComments'];

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
