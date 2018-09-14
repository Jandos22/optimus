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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <mat-select placeholder="Event Type" formControlName="EventType2"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of eventTypes" [value]="item">
            {{ item }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

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

  constructor() {}

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
}
