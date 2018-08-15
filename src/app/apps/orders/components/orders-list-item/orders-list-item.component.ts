import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as _ from 'lodash';

import * as differenceInDays from 'date-fns/difference_in_days';
import * as startOfToday from 'date-fns/start_of_today';
import * as distanceInWords from 'date-fns/distance_in_words';

// constants
import { SlbSpPath } from '../../../../shared/constants';

// interfaces
import {
  OrderItem,
  OrderLineItem,
  OrderStatus
} from '../../../../shared/interface/orders.model';
import { PeopleItem } from './../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-list-item',
  styleUrls: ['orders-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-inner-container" fxFlex="100" fxLayout="row wrap">

      <!-- Order Header -->
      <div class="order-header" fxLayout="row nowrap"
        (click)="openForm.emit(order)">

        <app-orders-requestor
          class="requestor"
          [requestor]="order.Requestor">
        </app-orders-requestor>

        <div class="details" fxLayout="row wrap">
          <div class="date">{{ order.OrderDate | date: 'mediumDate' }}</div>
          <div class="name">{{ order.OrderName }}</div>
        </div>

      </div>

      <!-- Last Updated Information -->
      <div class="order-last-updated" fxLayout="row nowrap"
        *ngIf="order.LastUpdatedFlag"
        [ngClass]="{ 'recent': isRecent, 'old': !isRecent }">

        <div fxFlex="16px" class="icon">

          <fa-icon *ngIf="!isRecent" [icon]="['fas', 'exclamation-circle']">
          </fa-icon>

          <fa-icon *ngIf="isRecent" [icon]="['fas', 'check-circle']">
          </fa-icon>

        </div>

        <div fxFlex class="text">{{ lastUpdated }}</div>

      </div>

      <app-orders-line-item class="line-item-container"
        *ngFor="let lineItem of lineItems" [lineItem]="lineItem">
      </app-orders-line-item>

    </div>
    `
})
export class OrdersListItemComponent implements OnChanges {
  @Input()
  order: OrderItem;

  @Input()
  last: boolean;

  @Input()
  orderStatuses: OrderStatus[];

  @Output()
  openForm = new EventEmitter<OrderItem>();

  lineItems: OrderLineItem[];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // watch changes of incoming order object
    if (changes.order && changes.order.currentValue) {
      console.log('changes detected');
      console.log(changes.order.currentValue);
      this.createLineItems(changes.order.currentValue);
    }
  }

  createLineItems(order: OrderItem) {
    const times = order.ActiveLineItems;
    console.log(times);

    // create new array of active line items
    const lineItems = _.times(times, n => {
      // conver index to string, e.g. '01'
      const str = (n + 1).toString();
      const nn = str.length === 1 ? '0' + str : str;

      // create line item object
      const lineItem: OrderLineItem = {
        line: nn,
        title: order['Ln' + nn + '_Title'],
        qty: order['Ln' + nn + '_Qty'],
        pn: order['Ln' + nn + '_PN'],
        orderNumber: order['Ln' + nn + '_OrderNumber'],
        orderStatusId: order['Ln' + nn + '_OrderStatusId'],
        orderStatus: this.getOrderStatus(order['Ln' + nn + '_OrderStatusId']),
        comments: order['Ln' + nn + '_Comments']
      };

      return lineItem;
    });

    this.lineItems = [...lineItems];
  }

  getOrderStatus(id: number): OrderStatus {
    return _.find(this.orderStatuses, (item: OrderStatus) => {
      return item.Id === id;
    });
  }

  requestorPhoto(user: PeopleItem) {
    if (user.Attachments) {
      if (user.AttachmentFiles.results) {
        return SlbSpPath + user.AttachmentFiles.results[0].ServerRelativeUrl;
      } else {
        return 'assets/no_user.png';
      }
    } else {
      return 'assets/no_user.png';
    }
  }

  requestorTooltip(user: PeopleItem) {
    return user.Fullname;
  }

  get isRecent() {
    const daysAgo = differenceInDays(startOfToday(), this.order.LastUpdated);
    return daysAgo < 14 ? true : false;
  }

  get lastUpdated() {
    const daysAgo = differenceInDays(startOfToday(), this.order.LastUpdated);
    const distance = distanceInWords(Date.now(), this.order.LastUpdated);
    const who = this.order.LastUpdatedBy.Fullname;
    return 'updated ' + distance + ' ago by ' + who;
  }
}
