import {
  Component,
  Input,
  OnInit,
  // Output,
  // EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
  // ChangeDetectorRef
} from '@angular/core';

// forms
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';
import { TimelineEventItem } from '../../../../../../shared/interface/timeline.model';

// services
import { TimelineTypeService } from '../../../../services';

@Component({
  selector: 'app-timeline-filters-issue-state',
  styleUrls: ['timeline-filters-issue-state.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters">
      <mat-select
        placeholder="Issue State"
        formControlName="issueState">
        <mat-option
          *ngFor="let item of issueState"
          [value]="item">
            {{ item }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['issueState'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class TimelineFiltersIssueStateComponent implements OnInit {
  @Input()
  fg_filters: FormGroup;

  issueState = ['Open', 'Closed'];

  constructor() {}

  ngOnInit() {}

  reset() {
    this.fg_filters.controls['issueState'].reset();
  }
}
