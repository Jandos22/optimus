import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, } from '@angular/forms';

// import * as moment from 'moment';

@Component({
  selector: 'app-timeline-form-event-date',
  styleUrls: ['timeline-form-event-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput
        placeholder="Event Date"
        [matDatepicker]="picker"
        formControlName="EventDate">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker touchUi #picker disabled="false"></mat-datepicker>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class TimelineFormEventDateComponent {
  @Input() fg_fields: FormGroup;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('EventDate').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('EventDate').hasError('required');

    return this.fg_fields.get('EventDate').touched
      ? required
        ? 'Event date is required'
        : ''
      : '';
  }
}
