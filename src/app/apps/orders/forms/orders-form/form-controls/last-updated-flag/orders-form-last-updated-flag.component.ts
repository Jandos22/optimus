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
  selector: 'app-orders-form-last-updated-flag',
  styleUrls: ['orders-form-last-updated-flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="fg_fields"
      matTooltip="Show, in list view, when order was last updated and who updated it">

      <mat-slide-toggle
        [formControlName]="fieldName"
        [color]="'primary'"
        [checked]="lastUpdatedFlagChecked"
        [disabled]="lastUpdatedFlagDisabled"
        [labelPosition]="'before'">
        <span class="toggle-last-updated-flag-text">Last Updated Flag</span>
      </mat-slide-toggle>
    </div>
  `
})
export class OrdersFormLastUpdatedFlagComponent {
  @Input()
  fg_fields: FormGroup;
  @Input()
  mode: FormMode;
  @Input()
  fieldName: string;

  constructor() {}

  get lastUpdatedFlagChecked() {
    return this.fg_fields.controls[this.fieldName].value;
  }

  get lastUpdatedFlagDisabled() {
    return this.mode === 'view' ? true : false;
  }
}
