import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { OrderItem } from '../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-list',
  styleUrls: ['orders-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="orders-list-container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-orders-list-item
        fxLayout="row nowrap"
        *ngFor="let order of orders; last as last"
        [order]="order"
        [ngClass]="{'last-item': last}"
        (openForm)="openForm.emit($event)">
      </app-orders-list-item>

    </div>
    `
})
export class OrdersListComponent {
  @Input() orders: OrderItem[];

  @Output() openForm = new EventEmitter<OrderItem>();

  constructor() {}
}
