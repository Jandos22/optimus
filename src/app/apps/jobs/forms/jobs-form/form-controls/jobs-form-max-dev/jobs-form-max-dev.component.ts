import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-jobs-form-max-dev',
  styleUrls: ['jobs-form-max-dev.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="calc(98% - 60px)" [formGroup]="fg_fields">

        <input
          matInput
          placeholder="Max Deviation"
          formControlName="MaxDeviation"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>

    <mat-form-field fxFlex="60px">

      <mat-select [formControl]="deviationUnits" disabled>
        <mat-option [value]="'deg'">deg</mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormMaxDevComponent implements OnInit {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  deviationUnits = new FormControl('deg');

  constructor() {}

  ngOnInit() {
    if (this.mode === 'new') {
      this.fg_fields.controls['MaxDeviation'].patchValue(0);
    }
  }

  get hasError() {
    return this.fg_fields.controls['MaxDeviation'].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['MaxDeviation'];
    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
