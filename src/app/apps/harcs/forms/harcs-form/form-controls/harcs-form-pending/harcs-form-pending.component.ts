import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-harcs-form-pending',
  styleUrls: ['harcs-form-pending.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
        <textarea matInput
          placeholder="What is pending"
          formControlName="PendingActions"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          cdkAutosizeMinRows="1"
          cdkAutosizeMaxRows="3">
        </textarea>
        <mat-hint align="end" *ngIf="mode !== 'view'">
          {{fg_fields.get('PendingActions').value?.length }} / 140
        </mat-hint>
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class HarcsFormPendingComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('PendingActions').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['PendingActions'];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return this.fg_fields.get('PendingActions').touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 140 characters allowed'
          : ''
      : '';
  }
}
