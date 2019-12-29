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
  selector: 'app-kaizen-filters-content',
  styleUrls: ['kaizen-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
      <app-filters-locations
        [fg_filters]="fg_filters"
        [locofinterest]="locofinterest"
        (updateLocationsofinterest)="updateLocationsofinterest.emit($event)"
      >
      </app-filters-locations>

      <app-form-control-people-selector
        class="cmn-form-component people-filter"
        fxLayout="row wrap"
        [fg_fields]="fg_filters"
        [mode]="'new'"
        [fieldName]="'doneBy'"
        [displayName]="'Done by'"
        [allowNumberOfUsers]="4"
        [selfUser]="selfUser"
        [doReset]="doReset"
        (onSelectUser)="onSelectDoneBy.emit($event)"
        [forFilters]="true"
        [includeOnly]="[]"
      >
      </app-form-control-people-selector>

    </div>
  `
})
export class KaizenFiltersContentComponent {
  @Input()
  fg_filters: FormGroup;

  @Input()
  locofinterest: number[];

  @Input()
  selfUser: PeopleItem;
  
  @Input()
  doReset: boolean;

  @Output()
  updateLocationsofinterest = new EventEmitter<number[]>();

  @Output()
  onSelectDoneBy = new EventEmitter<number[]>();

  constructor() {}
}
