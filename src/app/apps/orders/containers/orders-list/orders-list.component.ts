import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import {
  OrderItem,
  OrderStatus
} from '../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-list',
  styleUrls: ['orders-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="orders-list-container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-orders-links fxLayout="row nowrap" [location]="location">
      </app-orders-links>

      <app-orders-list-item
        fxLayout="row nowrap"
        *ngFor="let order of orders; last as last"
        [order]="order"
        [ngClass]="{'last-item': last}"
        [orderStatuses]="orderStatuses"
        (openForm)="openForm.emit($event)">
      </app-orders-list-item>

    </div>
    `
})
export class OrdersListComponent {
  @Input()
  orders: OrderItem[];

  @Input()
  orderStatuses: OrderStatus[];

  @Input()
  location: number;

  @Output()
  openForm = new EventEmitter<OrderItem>();

  constructor() {}
}
