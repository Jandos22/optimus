import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-timeline-form-issue-followup',
  styleUrls: ['timeline-form-issue-followup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
        <textarea matInput
          placeholder="Issue Follow Up"
          formControlName="FollowUp"
          cdkTextareaAutosize
          #autosize="cdkTextareaAutosize"
          cdkAutosizeMaxRows="1"
          cdkAutosizeMaxRows="6">
        </textarea>
        <mat-hint align="end" *ngIf="mode !== 'view'">
          {{fg_fields.get('FollowUp').value?.length }} / 255
        </mat-hint>
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class TimelineFormIssueFollowupComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('FollowUp').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['FollowUp'];

    const required = control.hasError('required');
    const max = control.hasError('maxlength');

    return this.fg_fields.get('Summary').touched
      ? required
        ? '... is required'
        : max
          ? 'maximum 255 characters allowed'
          : ''
      : '';
  }
}
