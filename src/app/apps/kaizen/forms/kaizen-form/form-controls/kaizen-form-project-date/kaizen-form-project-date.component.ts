import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-kaizen-form-project-date',
  styleUrls: ['kaizen-form-project-date.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <input matInput
        placeholder="Project Date"
        [matDatepicker]="picker"
        formControlName="ProjectDate">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker [disabled]="mode === 'view'"></mat-datepicker>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  `
})
export class KaizenFormProjectDateComponent {
  @Input()
  fg_fields: FormGroup;

  @Input()
  mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('ProjectDate').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('ProjectDate').hasError('required');

    return this.fg_fields.get('ProjectDate').touched
      ? required
        ? 'Project date is required'
        : ''
      : '';
  }
}
