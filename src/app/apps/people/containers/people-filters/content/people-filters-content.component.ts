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
  selector: 'app-people-filters-content',
  styleUrls: ['people-filters-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-content-container">

        <app-filters-locations
            [fg_filters]="fg_filters" [locofinterest]="locofinterest"
            (updateLocationsofinterest)="updateLocationsofinterest.emit($event)">
        </app-filters-locations>

    </div>
    `
})
export class PeopleFiltersContentComponent {
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
