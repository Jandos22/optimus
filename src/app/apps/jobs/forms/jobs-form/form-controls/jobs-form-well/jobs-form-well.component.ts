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
  selector: 'app-jobs-form-well',
  styleUrls: ['jobs-form-well.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

        <input
          matInput
          placeholder="Well"
          formControlName="Well"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormWellComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('Well').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('Well').hasError('required');

    return this.fg_fields.get('Well').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
