import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { FormMode } from '../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-harcs-form-status',
  styleUrls: ['harcs-form-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

      <mat-select placeholder="Status" formControlName="Status"
        [disabled]="mode === 'view'">

        <mat-option [value]="'Pending'">Pending</mat-option>
        <mat-option [value]="'Approved'">Approved</mat-option>

      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class HarcsFormStatusComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('Status').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['Status'];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
