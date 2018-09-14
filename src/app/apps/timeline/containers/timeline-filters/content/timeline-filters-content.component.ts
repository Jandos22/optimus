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
  selector: 'app-timeline-filters-content',
  styleUrls: ['timeline-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">
        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

        <app-timeline-filters-event-types-v2
            fxLayout="row nowrap"
            [fg_filters]="fg_filters">
        </app-timeline-filters-event-types-v2>

        <app-form-control-people-selector class="cmn-form-component people-filter"
            fxLayout="row wrap" [fg_fields]="fg_filters" [mode]="'new'"
            [fieldName]="'eventReporters'" [displayName]="'Event Reporters'" [allowNumberOfUsers]="4"
            [selfUser]="selfUser" [doReset]="doReset"
            (onSelectUser)="onSelectEventReporters.emit($event)" [forFilters]="true" [includeOnly]="[]">
        </app-form-control-people-selector>
    </div>
    `
})
export class TimelineFiltersContentComponent {
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
  onSelectEventReporters = new EventEmitter<number[]>();

  constructor() {}
}
