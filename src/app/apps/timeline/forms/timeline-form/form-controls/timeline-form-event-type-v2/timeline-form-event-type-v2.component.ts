import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { TimelineEventType } from '../../../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-form-event-type-v2',
  styleUrls: ['timeline-form-event-type-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- EventType -->
    <mat-form-field [formGroup]="fg_fields" class="left" [ngClass]="{ 'type-issue': issue}">

      <mat-select placeholder="Event Type" formControlName="EventType2"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of eventTypes" [value]="item">
            {{ item }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>

    <!-- IssueState -->
    <mat-form-field [formGroup]="fg_fields" class="right" *ngIf="issue" [ngClass]="{ 'state-issue': issue}">

      <mat-select placeholder="Issue State" formControlName="IssueState"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of issueState" [value]="item">
            {{ item }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError2">{{ errorMessage2 }}</mat-error>

    </mat-form-field>
  `
})
export class TimelineFormEventTypeV2Component {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

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

  issueState = ['Open', 'Closed'];

  constructor() {}

  get issue() {
    return this.fg_fields.get('EventType2').value === 'Issue' ? true : false;
  }

  get hasError() {
    return this.fg_fields.get('EventType2').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('EventType2').hasError('required');

    return this.fg_fields.get('EventType2').touched
      ? required
        ? 'Event Type is required'
        : ''
      : '';
  }

  get hasError2() {
    return this.fg_fields.get('IssueState').invalid;
  }

  get errorMessage2() {
    const required = this.fg_fields.get('IssueState').hasError('required');

    return this.fg_fields.get('IssueState').touched
      ? required
        ? 'Event Type is required'
        : ''
      : '';
  }
}
