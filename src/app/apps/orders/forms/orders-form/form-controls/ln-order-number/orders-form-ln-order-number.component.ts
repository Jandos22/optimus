import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit
} from "@angular/core";
import { FormGroup, FormControl, AbstractControl } from "@angular/forms";

// interfaces
import { FormMode } from "./../../../../../../shared/interface/form.model";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "app-orders-form-ln-order-number",
  styleUrls: ["orders-form-ln-order-number.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field
      fxFlex="100"
      [formGroup]="fg_fields"
      class="minus13"
      floatLabel="never"
    >
      <input
        matInput
        [placeholder]="'SC/PO/FMT'"
        [formControlName]="fieldName"
        autocomplete="off"
      />

      <button
        mat-icon-button
        matTooltip="check status via Supply Visibility"
        matSuffix
        *ngIf="isPurchaseOrder"
        (click)="openTMO(fg_fields.controls[this.fieldName].value)"
      >
        <span class="fa_regular"
          ><fa-icon [icon]="['fas', 'shopping-cart']"></fa-icon
        ></span>
      </button>
    </mat-form-field>
  `
})
export class OrdersFormLnOrderNumberComponent implements OnInit {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  @Input()
  fieldName: string;

  @Input()
  displayName: string;

  $react2orderNumber: Subscription;

  constructor() {}

  ngOnInit() {
    this.$react2orderNumber = this.fg_fields.controls[
      this.fieldName
    ].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(value => {
        const newValue = _.trim(value);
        this.fg_fields.controls[this.fieldName].setValue(newValue);
      });
  }

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
        `https://supplyvisibility.gt.slb.com/dashboard?poNumber=${orderNumber}`,
        "_blank"
      );
    }
  }
}
