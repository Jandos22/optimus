import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-jobs-form-job-type',
  styleUrls: ['jobs-form-job-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <mat-select placeholder="Job Type" formControlName="JobType" [disabled]="mode === 'view'">
        <mat-option [value]="'CH'">CH</mat-option>
        <mat-option [value]="'OH'">OH</mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormJobTypeComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('JobType').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('JobType').hasError('required');

    return this.fg_fields.get('JobType').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
