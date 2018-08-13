import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { OrderItem } from '../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-list-item',
  styleUrls: ['orders-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-inner-container" fxFlex="100" fxLayout="row nowrap">
      One Order
    </div>
    `
})
export class OrdersListItemComponent {
  @Input() order: OrderItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<OrderItem>();

  constructor() {}
}
