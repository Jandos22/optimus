import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-appraisals-form-did-ropesocket-h2s',
  styleUrls: ['appraisals-form-did-ropesocket-h2s.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields" fxFlex="100">
      <mat-checkbox formControlName="DidRopeSocketH2S">
        Prepared RopeSocket (H2S)
      </mat-checkbox>
    </div>
  `
})
export class AppraisalsFormDidRopeSocketH2SComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('DidRopeSocketH2S').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['DidRopeSocketH2S'];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
