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

        <app-orders-filters-order-name [fg_filters]="fg_filters">
        </app-orders-filters-order-name>

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
  @Input() fg_filters: FormGroup;
  @Input() locofinterest: number[];
  @Input() selfUser: PeopleItem;
  @Input() doReset: boolean;

  @Output() updateLocationsofinterest = new EventEmitter<number[]>();
  @Output() onSelectRequestors = new EventEmitter<number[]>();

  constructor() {}
}
