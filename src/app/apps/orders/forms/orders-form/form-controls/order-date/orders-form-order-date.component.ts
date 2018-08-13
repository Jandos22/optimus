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
  selector: 'app-orders-form-order-date',
  styleUrls: ['orders-form-order-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput
        placeholder="Order Date"
        [matDatepicker]="picker"
        formControlName="OrderDate">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker [disabled]="mode === 'view'"></mat-datepicker>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class OrdersFormOrderDateComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  fieldName = 'OrderDate';

  constructor() {}

  get hasError() {
    return this.fg_fields.controls[this.fieldName].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls[this.fieldName];

    const required = control.hasError('required');

    return control.touched ? (required ? '... date is required' : '') : '';
  }
}
