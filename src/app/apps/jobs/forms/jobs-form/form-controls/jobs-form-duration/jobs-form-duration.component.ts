import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { startWith } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';

import * as differenceInMinutes from 'date-fns/difference_in_minutes';

@Component({
  selector: 'app-jobs-form-duration',
  styleUrls: ['jobs-form-duration.component.scss'],
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields" class="job-duration">

        <span class='fa_regular' style="padding-right: 4px;">
            <fa-icon [icon]="['far', 'clock']"></fa-icon>
        </span>

        <input
            class="job-duration__input"
            matInput
            placeholder="Job Duration"
            formControlName="JobDuration"
            autocomplete="off">

        <span matSuffix class="hours">hours</span>

        <!-- <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error> -->

    </mat-form-field>
    `
})
export class JobsFormDurationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  $calculator: Subscription;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // watch mode changes
    if (changes.mode.currentValue === 'view') {
      // do nothing
    }
    if (
      changes.mode.currentValue === 'edit' ||
      changes.mode.currentValue === 'new'
    ) {
      this.startCalculator();
    }
  }

  startCalculator() {
    const dateFirst$ = this.fg_fields.controls['RigUpEnd'].valueChanges.pipe(
      startWith(this.fg_fields.controls['RigUpEnd'].value)
    );

    const dateSecond$ = this.fg_fields.controls['RigUpStart'].valueChanges.pipe(
      startWith(this.fg_fields.controls['RigUpStart'].value)
    );

    this.$calculator = combineLatest(dateFirst$, dateSecond$).subscribe(
      dates => {
        const duration = differenceInMinutes(dates[0], dates[1]) / 60;
        this.fg_fields.controls['JobDuration'].patchValue(duration);
      }
    );
  }

  ngOnDestroy() {
    this.$calculator.unsubscribe();
  }
}
