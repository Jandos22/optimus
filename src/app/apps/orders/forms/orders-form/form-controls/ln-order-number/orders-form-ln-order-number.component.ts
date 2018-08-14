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
  selector: 'app-orders-form-ln-order-number',
  styleUrls: ['orders-form-ln-order-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields"
      class="minus13" floatLabel="never">

        <input
          matInput
          [placeholder]="'SC/PO/FMT'"
          [formControlName]="fieldName"
          autocomplete="off">

        <button
          mat-icon-button
          matTooltip='check status via Track My Order'
          matSuffix
          *ngIf="isPurchaseOrder"
          (click)="openTMO(fg_fields.controls[this.fieldName].value)">
          <span class='fa_regular'><fa-icon [icon]="['fas', 'shopping-cart']"></fa-icon></span>
        </button>

    </mat-form-field>
  `
})
export class OrdersFormLnOrderNumberComponent {
  @Input()
  fg_fields: FormGroup;
  @Input()
  mode: FormMode;
  @Input()
  fieldName: string;
  @Input()
  displayName: string;

  constructor() {}

  get isPurchaseOrder() {
    const value: string = this.fg_fields.controls[this.fieldName].value;

    // PO example: WKAS00222A, 10 characters
    const characters = value && value.length === 10 ? true : false;
    // 10th character must be letter
    const isLetter = value ? this.isLetter(value.charAt(9)) : false;
    // 5th character must be number
    const isNumber = value ? this.isNumber(value.charAt(4)) : false;

    return characters && isLetter && isNumber;
  }

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  isNumber(str) {
    return str.length === 1 && str.match(/[0-9]/i);
  }

  openTMO(orderNumber: string) {
    if (orderNumber) {
      window.open(
        `https://trackmyorder.slb.com/_layouts/SLB.COE.ExpeditingConsole/ExpeditingConsoleTracking.aspx?PONo=${orderNumber}`,
        '_blank'
      );
    }
  }
}
