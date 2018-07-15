import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-exemptions-form-expiry-date',
  styleUrls: ['exemptions-form-expiry-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput
        placeholder="Expiry Date"
        [matDatepicker]="picker"
        formControlName="ExpiryDate">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker touchUi #picker [disabled]="mode === 'view'"></mat-datepicker>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class ExemptionsFormExpiryDateComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('ExpiryDate').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('ExpiryDate').hasError('required');

    return this.fg_fields.get('ExpiryDate').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
