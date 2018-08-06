import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';

import * as startOfToday from 'date-fns/start_of_today';
import * as endOfToday from 'date-fns/end_of_today';
import * as addDays from 'date-fns/add_days';

// interfaces
import { FormMode } from '../../../../../../shared/interface/form.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-harcs-filters-status',
  styleUrls: ['harcs-filters-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field
      class="forFilters">

      <mat-select placeholder="Status" [formControl]="harcStatus" multiple>

        <mat-option [value]="'Approved'">Approved</mat-option>
        <mat-option [value]="'Pending'">Pending</mat-option>
        <mat-option [value]="'Expired'">Expired</mat-option>
        <mat-option [value]="'Soon Expire'">Soon Expire</mat-option>

      </mat-select>

    </mat-form-field>

    <!-- button to select harcs that are not ok -->
    <div class='quick-filter-button'
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Show HARCs that require attention'" (click)="showNotOkHarcs()">
      <fa-icon [icon]="['fas', 'exclamation-circle']"></fa-icon>
    </div>
    `
})
export class HarcsFiltersStatusComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_filters: FormGroup;
  @Input() initStatusWith: string;
  @Input() doReset: boolean;

  harcStatus: FormControl;

  status$: Observable<string[]>;

  $status: Subscription;

  constructor() {}

  ngOnInit() {
    this.initFormControl(this.initStatusWith);
    this.startObservables();
    this.startSubscriptions();
  }

  ngOnDestroy() {
    this.$status.unsubscribe();
  }

  initFormControl(status: string) {
    status = status ? status : '';
    this.harcStatus = new FormControl(status);
  }

  startObservables() {
    this.status$ = this.harcStatus.valueChanges;
  }

  startSubscriptions() {
    // subscribe to local form control
    this.$status = this.status$.subscribe((status: string[]) => {
      console.log(status);
      this.fg_filters.controls['status'].patchValue(status);
    });
  }

  showNotOkHarcs() {
    const notOk = ['Pending', 'Expired', 'Soon Expire'];
    this.fg_filters.controls['status'].patchValue(notOk);
    this.harcStatus.patchValue(notOk);
  }

  findApproved(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Approved';
    });
  }

  findPending(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Pending';
    });
  }

  updateFiltersApprovedPending(status: string[]) {
    this.fg_filters.controls['status'].patchValue(status);
  }

  updateFiltersExpired(status: string[]) {
    const approved = this.findApproved(status);

    const prev: string[] = this.fg_filters.controls['status'].value;

    if (!approved) {
      if (prev.length) {
        this.fg_filters.controls['status'].patchValue([...prev, 'Approved']);
      } else {
        this.fg_filters.controls['status'].patchValue(['Approved']);
      }
    }

    this.fg_filters.controls['beforeDate'].patchValue(endOfToday());
    this.fg_filters.controls['afterDate'].patchValue('');
  }

  updateFiltersSoonExpire(status) {
    const approved = this.findApproved(status);

    const prev = this.fg_filters.controls['status'].value;

    if (!approved) {
      this.fg_filters.controls['status'].patchValue([...prev, 'Approved']);
    }

    const before = addDays(endOfToday(), 14);
    const after = startOfToday();

    this.fg_filters.controls['status'].patchValue('Approved');
    this.fg_filters.controls['beforeDate'].patchValue(before);
    this.fg_filters.controls['afterDate'].patchValue(after);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.doReset) {
      if (changes.doReset.currentValue) {
        console.log('reset');
        if (changes.doReset.currentValue !== changes.doReset.previousValue) {
          this.harcStatus.patchValue('');
        }
      }
    }
  }
}
