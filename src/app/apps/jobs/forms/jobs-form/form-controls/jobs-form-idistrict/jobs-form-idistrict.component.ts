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
  selector: 'app-jobs-form-idistrict',
  styleUrls: ['jobs-form-idistrict.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">

        <input
          matInput
          placeholder="iDistrict"
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

    return this.fg_fields.get('iDistrict').touched
      ? required
        ? '... is required'
        : ''
      : '';
  }

  openJRI() {
    const iDistrict = this.fg_fields.controls['iDistrict'].value;
    if (iDistrict) {
      window.open(
        `https://operationsportal.slb.com/fsmhome/pages/JRIQuestions.aspx?jobid=${iDistrict}&category=0`,
        '_blank'
      );
    }
  }
}
