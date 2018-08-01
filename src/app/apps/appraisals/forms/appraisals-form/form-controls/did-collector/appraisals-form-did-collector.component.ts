import { FormMode } from './../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-appraisals-form-did-collector',
  styleUrls: ['appraisals-form-did-collector.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields" fxFlex="100">
      <mat-checkbox formControlName="DidCollector">
        Prepared Collector
      </mat-checkbox>
    </div>
  `
})
export class AppraisalsFormDidCollectorComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  constructor() {}

  get hasError() {
    return this.fg_fields.get('DidCollector').invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls['DidCollector'];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
