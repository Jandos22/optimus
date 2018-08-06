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
  selector: 'app-harcs-filters-content',
  styleUrls: ['harcs-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

        <app-harcs-filters-status class="cmn-form-component people-filter"
            fxLayout="row wrap"
            [fg_filters]="fg_filters" [doReset]="doReset">
        </app-harcs-filters-status>

        <app-form-control-people-selector class="cmn-form-component people-filter"
            fxLayout="row wrap" [fg_fields]="fg_filters" [mode]="'new'"
            [fieldName]="'pic'" [displayName]="'Person In Charge'" [allowNumberOfUsers]="1"
            [selfUser]="selfUser" [doReset]="doReset"
            (onSelectUser)="onSelectPic.emit($event)" [forFilters]="true" [includeOnly]="[]">
        </app-form-control-people-selector>
    </div>
    `
})
export class HarcsFiltersContentComponent {
  @Input() fg_filters: FormGroup;
  @Input() locofinterest: number[];
  @Input() selfUser: PeopleItem;
  @Input() doReset: boolean;

  @Output() updateLocationsofinterest = new EventEmitter<number[]>();
  @Output() onSelectPic = new EventEmitter<number[]>();

  constructor() {}
}
