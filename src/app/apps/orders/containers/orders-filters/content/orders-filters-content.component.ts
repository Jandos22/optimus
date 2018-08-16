// core
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

// interfaces
import { PeopleItem } from '../../../../people/models/people-item.model';
import { OrderStatus } from '../../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-filters-content',
  styleUrls: ['orders-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

        <app-orders-filters-last-update [fg_filters]="fg_filters" fxLayout="row nowrap">
        </app-orders-filters-last-update>

        <app-orders-filters-order-status
            fxLayout="row nowrap"
            [fg_filters]="fg_filters" [orderStatuses]="orderStatuses">
        </app-orders-filters-order-status>

        <app-orders-filters-order-number [fg_filters]="fg_filters" fxLayout="row nowrap">
        </app-orders-filters-order-number>

        <app-orders-filters-part-number [fg_filters]="fg_filters" fxLayout="row nowrap">
        </app-orders-filters-part-number>

        <app-form-control-people-selector class="cmn-form-component people-filter"
            fxLayout="row wrap" [fg_fields]="fg_filters" [mode]="'new'"
            [fieldName]="'requestors'" [displayName]="'Requestors'" [allowNumberOfUsers]="2"
            [selfUser]="selfUser" [doReset]="doReset"
            (onSelectUser)="onSelectRequestors.emit($event)" [forFilters]="true" [includeOnly]="[]">
        </app-form-control-people-selector>

    </div>
    `
})
export class OrdersFiltersContentComponent {
  @Input()
  fg_filters: FormGroup;

  @Input()
  locofinterest: number[];

  @Input()
  selfUser: PeopleItem;

  @Input()
  doReset: boolean;

  @Input()
  orderStatuses: OrderStatus[];

  @Output()
  updateLocationsofinterest = new EventEmitter<number[]>();

  @Output()
  onSelectRequestors = new EventEmitter<number[]>();

  constructor() {}
}
