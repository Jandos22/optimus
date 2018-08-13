import { OrderStatus } from './../../../../../../shared/interface/orders.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-orders-form-ln-order-status',
  styleUrls: ['orders-form-ln-order-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields"
      class="minus13" floatLabel="never">

        <mat-select
          [placeholder]="'Order Status'"
          [formControlName]="fieldName">
          <mat-option *ngFor="let orderStatus of orderStatuses" [value]="orderStatus.Id">
            {{ orderStatus.Title }}
          </mat-option>
        </mat-select>

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class OrdersFormLnOrderStatusComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;
  @Input() orderStatuses: OrderStatus[];
  @Input() fieldName: string;
  @Input() displayName: string;

  constructor() {}

  get hasError() {
    return this.fg_fields.get(this.fieldName).invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.get(this.fieldName);

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
