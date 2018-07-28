import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from '../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-people-form-shortname',
  styleUrls: ['people-form-shortname.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="fg_fields" fxFlex class="my-form-field_container">
    <mat-form-field fxFlexFill>
        <input matInput placeholder="Short Name" formControlName="Shortname" autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

        <mat-hint align="end" *ngIf="mode !== 'view'">
          e.g. Miller, R.
        </mat-hint>

    </mat-form-field>
  </div>
  `
})
export class PeopleFormShortnameComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.controls['Shortname'].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['Shortname'];

    const required = control.hasError('required');

    return control.touched ? (required ? 'Name is required' : '') : '';
  }
}
