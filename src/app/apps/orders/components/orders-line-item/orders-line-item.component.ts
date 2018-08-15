import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// constants
import { SlbSpPath } from '../../../../shared/constants';

// interfaces
import {
  OrderItem,
  OrderStatus,
  OrderLineItem
} from '../../../../shared/interface/orders.model';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-line-item',
  styleUrls: ['orders-line-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view-lineitem-inner-container" fxLayout="row wrap"
      [ngClass]="{
        'order-placed': (lineItem.orderStatusId === 1),
        'pending-approval': (lineItem.orderStatusId === 2),
        'fmt-confirmed': (lineItem.orderStatusId === 3),
        'po-created': (lineItem.orderStatusId === 4),
        'waiting-gl': (lineItem.orderStatusId === 5),
        'gl-released': (lineItem.orderStatusId === 6),
        'customs-clearance': (lineItem.orderStatusId === 7),
        'received': (lineItem.orderStatusId === 8),
        'cancelled': (lineItem.orderStatusId === 9)
      }">

      <div class="line">{{ lineItem.line }}</div>

      <div class="part-number">
        {{ lineItem.pn }}
      </div>

      <div class="quantity">{{ lineItem.qty }} ea</div>

      <div class="title">{{ lineItem.title }}</div>

      <div class="order-number"
        [ngClass]="{ 'isPO': isPurchaseOrder }"
        (click)="openTMO(this.lineItem.orderNumber)">
        {{ lineItem.orderNumber }}
      </div>

      <div class="comments" [matTooltip]="lineItem.comments">{{ lineItem.comments }}</div>

      <div class="order-status" [matTooltip]="lineItem.orderStatus?.Title">
        {{ lineItem.orderStatus?.Title }}
      </div>

    </div>
    `
})
export class OrdersLineItemComponent {
  @Input()
  lineItem: OrderLineItem;

  constructor() {}

  get isPurchaseOrder() {
    const value: string = this.lineItem.orderNumber;

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
    if (orderNumber && this.isPurchaseOrder) {
      window.open(
        `http://trackmyorder.slb.com/_layouts/SLB.COE.ExpeditingConsole/ExpeditingConsoleTracking.aspx?PONo=${orderNumber}`,
        '_blank'
      );
    }
  }
}
