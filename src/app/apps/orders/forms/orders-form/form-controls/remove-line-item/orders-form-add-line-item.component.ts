import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

interface OnRemoveLineItem {
  curr: string;
  total: number;
}

@Component({
  selector: 'app-orders-form-remove-line-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``
})
export class OrdersFormRemoveLineItemComponent implements OnChanges {
  @Input()
  fg_fields: FormGroup;
  @Input()
  mode: FormMode;
  @Input()
  removeLineItem: OnRemoveLineItem;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.removeLineItem) {
      console.log(changes.removeLineItem.currentValue);
      if (changes.removeLineItem.currentValue) {
        this.replaceLineItem(changes.removeLineItem.currentValue);
      }
    }
  }

  replaceLineItem(data: OnRemoveLineItem) {
    const ln = _.toNumber(data.curr);

    if (data.total - ln > 0) {
      const times = data.total - ln;

      _.times(times, (i: number) => {
        const currString = (ln + i).toString();
        const currLineItem =
          currString.length === 1 ? '0' + currString : currString;
        const nextString = (ln + i + 1).toString();
        const nextLineItem =
          nextString.length === 1 ? '0' + nextString : nextString;

        const title = this.fg_fields.controls[`Ln${nextLineItem}_Title`].value;
        this.fg_fields.controls[`Ln${nextLineItem}_Title`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_Title`].patchValue(title);

        const qty = this.fg_fields.controls[`Ln${nextLineItem}_Qty`].value;
        this.fg_fields.controls[`Ln${nextLineItem}_Qty`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_Qty`].patchValue(qty);

        const pn = this.fg_fields.controls[`Ln${nextLineItem}_PN`].value;
        this.fg_fields.controls[`Ln${nextLineItem}_PN`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_PN`].patchValue(pn);

        const ordernumber = this.fg_fields.controls[
          `Ln${nextLineItem}_OrderNumber`
        ].value;
        this.fg_fields.controls[`Ln${nextLineItem}_OrderNumber`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_OrderNumber`].patchValue(
          ordernumber
        );

        const orderstatus = this.fg_fields.controls[
          `Ln${nextLineItem}_OrderStatusId`
        ].value;
        this.fg_fields.controls[`Ln${nextLineItem}_OrderStatusId`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_OrderStatusId`].patchValue(
          orderstatus
        );

        const comments = this.fg_fields.controls[`Ln${nextLineItem}_Comments`]
          .value;
        this.fg_fields.controls[`Ln${nextLineItem}_Comments`].reset();
        this.fg_fields.controls[`Ln${currLineItem}_Comments`].patchValue(
          comments
        );
      });

      this.fg_fields.controls['ActiveLineItems'].patchValue(data.total - 1);
    } else {
      this.fg_fields.controls[`Ln${data.curr}_Title`].reset();
      this.fg_fields.controls[`Ln${data.curr}_Qty`].reset();
      this.fg_fields.controls[`Ln${data.curr}_PN`].reset();
      this.fg_fields.controls[`Ln${data.curr}_OrderNumber`].reset();
      this.fg_fields.controls[`Ln${data.curr}_OrderStatusId`].reset();
      this.fg_fields.controls[`Ln${data.curr}_Comments`].reset();
      this.fg_fields.controls['ActiveLineItems'].patchValue(data.total - 1);
    }
  }
}
