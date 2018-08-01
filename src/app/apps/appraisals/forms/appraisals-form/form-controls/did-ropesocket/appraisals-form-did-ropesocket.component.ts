import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-appraisals-form-did-ropesocket',
  styleUrls: ['appraisals-form-did-ropesocket.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields" fxFlex="100">
      <mat-checkbox formControlName="DidRopeSocket">
        Prepared RopeSocket (Standard)
      </mat-checkbox>
    </div>
  `
})
export class AppraisalsFormDidRopeSocketComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('DidRopeSocket').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['DidRopeSocket'];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
