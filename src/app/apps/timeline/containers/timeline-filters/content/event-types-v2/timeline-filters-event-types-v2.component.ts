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
  selector: 'app-timeline-filters-event-types-v2',
  styleUrls: ['timeline-filters-event-types-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters">
      <mat-select
        placeholder="Event Type"
        formControlName="eventType">
        <mat-option
          *ngFor="let item of eventTypes"
          [value]="item">
            {{ item }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['eventType'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class TimelineFiltersEventTypesV2Component implements OnInit {
  @Input()
  fg_filters: FormGroup;

  eventTypes = [
    'Note',
    'Issue',
    'SET Meeting',
    'SQ Meeting',
    'Success Story',
    'Team Building',
    'Equipment In',
    'Equipment Out'
  ];

  constructor() {}

  ngOnInit() {}

  reset() {
    this.fg_filters.controls['eventType'].reset();
  }
}
