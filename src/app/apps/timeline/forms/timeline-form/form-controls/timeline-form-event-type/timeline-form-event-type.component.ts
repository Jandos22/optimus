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
  selector: 'app-timeline-form-event-type',
  styleUrls: ['timeline-form-event-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <mat-select placeholder="Event Type" formControlName="EventTypeId"
        [disabled]="mode === 'view'">

        <mat-option *ngFor="let item of eventTypes" [value]="item.id">
            {{ item.Title }}
        </mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class TimelineFormEventTypeComponent {
  @Input() fg_fields: FormGroup;
  @Input() eventTypes: TimelineEventType[];
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('EventTypeId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('EventTypeId').hasError('required');

    return this.fg_fields.get('EventTypeId').touched
      ? required
        ? 'EventTypeId is required'
        : ''
      : '';
  }
}
