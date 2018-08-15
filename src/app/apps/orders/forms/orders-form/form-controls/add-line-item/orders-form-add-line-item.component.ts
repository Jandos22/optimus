import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-orders-form-add-line-item',
  styleUrls: ['orders-form-add-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [matTooltip]='getTooltip()'>
        <button mat-icon-button tabindex="-1"
            class="orders-btn-add-line-item"
            [disabled]="limitReached"
            (click)="onAddLineItem()">
            <span class='fa_regular'>
                <fa-icon [icon]="['fas', 'plus']"></fa-icon>
            </span>
        </button>
    <div>
    `
})
export class OrdersFormAddLineItemComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  // total allowed number of line items
  lineItemsMax = 12;

  constructor() {}

  get limitReached() {
    const activeLineItems = this.fg_fields.controls['ActiveLineItems'].value;
    return activeLineItems === this.lineItemsMax ? true : false;
  }

  onAddLineItem() {
    const lineItems = this.fg_fields.controls['ActiveLineItems'];
    const initial: number = lineItems.value;

    if (initial < this.lineItemsMax) {
      console.log(
        'line items count changes from ' + initial + ' to ' + (initial + 1)
      );
      console.log('maximum allowed line items is ' + this.lineItemsMax);
      this.fg_fields.controls['ActiveLineItems'].patchValue(initial + 1);
    } else {
      console.log('cannot exceed max sections: ' + this.lineItemsMax);
    }
  }

  getTooltip() {
    if (this.limitReached) {
      return `Line Items LIMIT reached (${this.lineItemsMax})`;
    } else {
      return 'Add Line Item';
    }
  }
}
