import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

// iDistrict has been retired, FDP was introduced instead
// however, the component name can stay as iDistrict
// 25-Jan-2020 Zhandos Ombayev

import * as _ from 'lodash';

@Component({
  selector: 'app-jobs-form-idistrict',
  styleUrls: ['jobs-form-idistrict.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

        <input
          matInput
          placeholder="Operational Activity"
          formControlName="iDistrict"
          autocomplete="off">

        <button
          mat-icon-button
          matTooltip='Open JRI'
          matSuffix
          *ngIf="this.fg_fields.controls['iDistrict'].value && !this.fg_fields.controls['iDistrict'].errors"
          (click)="openJRI()">
          <span class='fa_regular'><fa-icon [icon]="['fas', 'link']"></fa-icon></span>
        </button>

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormIdistrictComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('iDistrict').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('iDistrict').hasError('required');

    const isA = _.startsWith(this.fg_fields.get('iDistrict').value, 'A')

    const errors = { ...this.fg_fields.errors };

    if (!isA) {
      this.fg_fields.get('iDistrict').markAsTouched();
      this.fg_fields.get('iDistrict').setErrors({ ...errors, notA: true });
    } else if (isA) {
      this.fg_fields.get('iDistrict').markAsTouched();
      this.fg_fields.get('iDistrict').setErrors({ ...errors, notA: true });
    }

    console.log(isA);

    return this.fg_fields.get("iDistrict").touched 
      ? required 
        ? "... is required"
        : !isA 
        ? "starts with letter A"
        : ""
      : "";
  }

  openJRI() {
    const iDistrict = this.fg_fields.controls['iDistrict'].value;

    if (iDistrict) {

      if (this.fg_fields.get('isFDP').value) {

        if (iDistrict) {
          let fdp = _.split(iDistrict, '.');
      
          window.open(
            `https://fdp.slb.com/apps/jobmanagement/#/operation/O.${fdp[1]}.${fdp[2]}/activity/${iDistrict}/WL`,
            '_blank'
          );      

        }

      } else {
        window.open(
          `https://operationsportal.slb.com/fsmhome/pages/JRIQuestions.aspx?jobid=${iDistrict}&category=0`,
          '_blank'
        );
      }
      
    }
  }
}
