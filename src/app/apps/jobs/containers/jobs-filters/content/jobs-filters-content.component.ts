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

// people group ids
import { people_fefs } from './../../../../../shared/constants/ids-fefs';
import { people_op } from '../../../../../shared/constants/ids-op';

@Component({
  selector: 'app-jobs-filters-content',
  styleUrls: ['jobs-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

        <app-jobs-filters-job-type [fg_filters]="fg_filters" fxLayout="row nowrap">
        </app-jobs-filters-job-type>

        <app-jobs-filters-well [fg_filters]="fg_filters" fxLayout="row nowrap">
        </app-jobs-filters-well>

        <app-form-control-people-selector class="cmn-form-component people-filter"
            fxLayout="row wrap" [fg_fields]="fg_filters" [mode]="'new'"
            [fieldName]="'engineers'" [displayName]="'Engineers'" [allowNumberOfUsers]="4"
            [selfUser]="selfUser" [doReset]="doReset"
            (onSelectUser)="onSelectEngineers.emit($event)" [forFilters]="true" [includeOnly]="engineerIds">
        </app-form-control-people-selector>

        <app-form-control-people-selector class="cmn-form-component people-filter"
            fxLayout="row wrap" [fg_fields]="fg_filters" [mode]="'new'"
            [fieldName]="'operators'" [displayName]="'Operators'" [allowNumberOfUsers]="4"
            [selfUser]="selfUser" [doReset]="doReset"
            (onSelectUser)="onSelectOperators.emit($event)" [forFilters]="true" [includeOnly]="operatorsIds">
        </app-form-control-people-selector>

    </div>
    `
})
export class JobsFiltersContentComponent {
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
  onSelectEngineers = new EventEmitter<number[]>();
  @Output()
  onSelectOperators = new EventEmitter<number[]>();

  engineerIds = people_fefs;
  operatorsIds = people_op;

  constructor() {}
}
