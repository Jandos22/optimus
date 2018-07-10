import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-timeline-form-summary',
  styleUrls: ['timeline-form-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
        <textarea matInput
          placeholder="Summary"
          formControlName="Summary"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          cdkAutosizeMaxRows="1"
          cdkAutosizeMaxRows="3">
        </textarea>
        <mat-hint align="end" *ngIf="mode !== 'view'">
          {{fg_fields.get('Summary').value?.length }} / 140
        </mat-hint>
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class TimelineFormSummaryComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('Summary').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['Summary'];

    const required = control.hasError('required');
    const min = control.hasError('minlength');
    const max = control.hasError('maxlength');

    return this.fg_fields.get('Summary').touched
      ? required
        ? '... is required'
        : min
          ? 'minimum 60 characters required'
          : max
            ? 'maximum 140 characters allowed'
            : ''
      : '';
  }
}
