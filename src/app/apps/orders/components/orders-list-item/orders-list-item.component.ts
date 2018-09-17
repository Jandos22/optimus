import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

// rxjs
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// lodash
import * as _ from 'lodash';

// constants
import { SlbSpPath } from '../../../../shared/constants';

// interfaces
import {
  OrderItem,
  OrderLineItem,
  OrderStatus
} from '../../../../shared/interface/orders.model';
import { PeopleItem } from './../../../../shared/interface/people.model';
import { LocationEnt } from './../../../../shared/interface/locations.model';

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
          [requestorId]="order.RequestorId">
        </app-orders-requestor>

        <div class="details" fxLayout="row wrap">
          <div class="date">{{ order.OrderDate | date: 'mediumDate' }}</div>
          <div class="name">{{ order.OrderName }}</div>
        </div>

      </div>

      <app-orders-last-updated style="width: 100%;"
        *ngIf="order.LastUpdatedFlag"
        [lastUpdatedById]="order.LastUpdatedById"
        [lastUpdatedDate]="order.LastUpdated"
        [lastUpdatedFlag]="order.LastUpdatedFlag">
      </app-orders-last-updated>

      <app-orders-line-item class="line-item-container"
        *ngFor="let lineItem of lineItems" [lineItem]="lineItem">
      </app-orders-line-item>

      <app-locations-card
        class="locations-card-top-right"
        [locations]="location$ | async">
      </app-locations-card>

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

  location$: Observable<LocationEnt>;
  // locationTitle$: Observable<string>;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // watch changes of incoming order object
    if (changes.order && changes.order.currentValue) {
      const currentLocation = changes.order.currentValue as OrderItem;
      this.createLineItems(changes.order.currentValue);
      this.refreshLocationTitle(currentLocation.LocationId);
    }
  }

  refreshLocationTitle(id: number) {
    // console.log(id);
    this.location$ = this.store_root.pipe(
      take(1),
      select(fromRoot.getLocationById(id))
      // tap(v => console.log(v))
    );
  }

  createLineItems(order: OrderItem) {
    const times = order.ActiveLineItems;
    // console.log(times);

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
}
