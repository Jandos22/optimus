import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

// forms
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';

// rxjs
import { Subscription } from 'rxjs';
import {
  take,
  tap,
  pairwise,
  debounceTime,
  startWith,
  distinctUntilChanged
} from 'rxjs/operators';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';
import { TimelineEventItem } from '../../../../../../shared/interface/timeline.model';

// services
import { TimelineTypeService } from '../../../../services';

@Component({
  selector: 'app-timeline-filters-event-types',
  styleUrls: ['timeline-filters-event-types.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_filters">
      <mat-select
        placeholder="Event Types"
        formControlName="eventTypes"
        multiple>
        <mat-option
          *ngFor="let item of eventTypes"
          [value]="item.Id">
            {{ item.Title }}
        </mat-option>
      </mat-select>
    </mat-form-field>
    `
})
export class TimelineFiltersEventTypesComponent implements OnInit {
  @Input() fg_filters: FormGroup;

  eventTypes: TimelineEventItem[] = [];

  $fetch: Subscription;
  fetching: boolean;

  constructor(private srv: TimelineTypeService, private cd: ChangeDetectorRef) {
    this.fetch();
  }

  ngOnInit() {}

  fetch() {
    this.fetching = true;

    this.$fetch = this.srv
      .getEventTypes()
      .pipe(
        take(1),
        tap(v => console.log(v))
      )
      .subscribe(success => this.fetchSuccess(success as TimelineEventItem[]));
  }

  fetchSuccess(eventTypes: TimelineEventItem[]) {
    this.fetching = false;
    this.eventTypes = [...eventTypes];
    this.cd.detectChanges();
  }

  fetchError(error) {
    console.log(error);
    this.fetching = false;
    this.eventTypes = [];
    this.cd.detectChanges();
  }
}
