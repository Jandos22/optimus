import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces

@Component({
  selector: 'app-people-form-name',
  styleUrls: ['people-form-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [formGroup]="fg_fields" fxFlex class="my-form-field_container">
    <mat-form-field fxFlexFill>
        <input matInput placeholder="Name" formControlName="Name" autocomplete="off">
        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
  </div>
  `
})
export class PeopleFormNameComponent {
  @Input() fg_fields: FormGroup;
  // @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.controls['Name'].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['Name'];

    const required = control.hasError('required');

    return control.touched ? (required ? 'Name is required' : '') : '';
  }
}
