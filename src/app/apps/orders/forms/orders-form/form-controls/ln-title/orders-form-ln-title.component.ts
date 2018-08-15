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
  selector: 'app-orders-form-ln-title',
  styleUrls: ['orders-form-ln-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields"
      class="minus13" floatLabel="never">

        <input
          matInput
          [placeholder]="'Line Item Title'"
          [formControlName]="fieldName"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class OrdersFormLnTitleComponent {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;
  @Input() fieldName: string;
  @Input() displayName: string;

  constructor() {}

  get hasError() {
    return this.fg_fields.get(this.fieldName).invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.get(this.fieldName);

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
