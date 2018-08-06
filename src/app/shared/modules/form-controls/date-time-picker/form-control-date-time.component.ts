import { startWith } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription, combineLatest } from 'rxjs';

import * as _ from 'lodash';
import * as parse from 'date-fns/parse';
import * as startOfDay from 'date-fns/start_of_day';
import * as getDate from 'date-fns/get_date';
import * as getMonth from 'date-fns/get_month';
import * as getYear from 'date-fns/get_year';
import * as getHours from 'date-fns/get_hours';
import * as getMinutes from 'date-fns/get_minutes';
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';

// interfaces
import { FormMode } from './../../../../shared/interface/form.model';

interface DateTime {
  Date: Date;
  Hours: string;
  Minutes: string;
}

@Component({
  selector: 'app-form-control-date-time',
  styleUrls: ['form-control-date-time.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div fxFlex="100" [formGroup]="fg_DateTime"
    class="date-time-picker-container"
    fxLayout="row nowrap" fxLayoutAlign="space-between">

    <mat-form-field fxFlex="54">
      <input matInput
        style="font-size: 13px !important;"
        [placeholder]="displayName"
        [matDatepicker]="picker"
        formControlName="Date">
      <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="mode === 'view'"></mat-datepicker-toggle>
      <mat-datepicker #picker [disabled]="mode === 'view'"></mat-datepicker>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>

    <mat-form-field fxFlex="22">
      <mat-select [disabled]="mode === 'view'"
        style="font-size: 13px !important;"
        placeholder="Hrs."
        formControlName="Hours">
        <mat-option *ngFor="let hour of hours" [value]="hour">
            {{ hour }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field fxFlex="22">
      <mat-select [disabled]="mode === 'view'"
        style="font-size: 13px !important;"
        placeholder="Min."
        formControlName="Minutes">
        <mat-option *ngFor="let minute of minutes" [value]="minute">
            {{ minute }}
        </mat-option>
      </mat-select>
    </mat-form-field>

  </div>
  `
})
export class FormControlDateTimeComponent implements OnInit, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;
  @Input() fieldName: string;
  @Input() displayName: string;

  fg_DateTime: FormGroup;

  hours: string[];
  minutes: string[];

  converter: Subscription;

  constructor(
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.createHoursArray();
    this.createMinutesArray();
  }

  ngOnInit() {
    // this.initialize(this.fg_fields.controls[this.fieldName].value);
    // this.startDateTimeConverter();
  }

  startDateTimeConverter() {
    this.converter = this.fg_DateTime.valueChanges.subscribe(
      (rawDateTime: DateTime) => {
        this.convert(rawDateTime);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // watch mode changes
    if (changes.mode.currentValue === 'view') {
      this.initialize(this.fg_fields.controls[this.fieldName].value);
    }
    if (
      changes.mode.currentValue === 'edit' ||
      changes.mode.currentValue === 'new'
    ) {
      this.initialize(this.fg_fields.controls[this.fieldName].value);
      this.startDateTimeConverter();
    }
  }

  initialize(date: Date) {
    // check if date is empty
    const emptyDate = date ? false : true;

    let hours;
    let minutes;

    // if date is not empty, then process it
    if (!emptyDate) {
      hours = this.prefixZero(getHours(date));
      minutes = this.prefixZero(getMinutes(date));
    }

    this.fg_DateTime = this.fb.group({
      Date: [
        {
          value: emptyDate ? startOfDay(new Date()) : date,
          disabled: this.getDateState(this.mode)
        },
        Validators.required
      ],
      Hours: emptyDate ? '00' : hours,
      Minutes: emptyDate ? '00' : minutes
    });
  }

  // createDateTimeFormGroup() {}

  getDateState(mode: FormMode) {
    if (mode === 'view') {
      return true;
    } else {
      return false;
    }
  }

  convert(rawDateTime: DateTime) {
    console.log('DateTime form was updated:');
    console.log(rawDateTime);

    // process incoming Date to get stringified version
    // example: 2014-04-22
    // which is April 22, 2014
    const day = this.prefixZero(getDate(rawDateTime.Date));
    const month = this.prefixZero(getMonth(rawDateTime.Date) + 1); // 0 is January
    const year = getYear(rawDateTime.Date).toString();
    const hours = rawDateTime.Hours;
    const mins = rawDateTime.Minutes;

    const composed = `${year}-${month}-${day}T${hours}:${mins}:00`;
    console.log('compose new date string: ' + composed);

    const datetime = parse(composed);
    console.log('convert new date into Date: ' + datetime);

    this.updateDateTimeFormControl(datetime);
  }

  createHoursArray() {
    this.hours = _.times(24, function(i: number) {
      let hour = i.toString();
      hour = hour.length === 1 ? `0${hour}` : hour;
      return hour;
    });
  }

  createMinutesArray() {
    this.minutes = _.times(4, function(i: number) {
      let minute = (i * 15).toString();
      minute = minute.length === 1 ? `0${minute}` : minute;
      return minute;
    });
  }

  get hasError() {
    const invalid = this.fg_DateTime.controls['Date'].invalid;
    if (invalid) {
      this.updateDateTimeFormControl(null);
    }
    return invalid;
  }

  get errorMessage() {
    const control = this.fg_DateTime.controls['Date'];

    const required = control.hasError('required');
    const invalidDate = control.hasError('matDatepickerParse');

    console.log(invalidDate);

    return control.touched
      ? required
        ? 'mm/dd/yyyy'
        : invalidDate
          ? 'mm/dd/yyyy'
          : ''
      : '';
  }

  prefixZero(number: number) {
    const value = number.toString();
    return value.length === 1 ? `0${value}` : value;
  }

  updateDateTimeFormControl(newDate: Date | null) {
    console.log('update item form control');
    this.fg_fields.controls[this.fieldName].patchValue(newDate);
  }

  log() {
    console.log(this.fg_DateTime.controls['Date']);
    console.log(this.fg_DateTime.value);
  }
}
