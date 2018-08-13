import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders-filters-order-name',
  styleUrls: ['orders-filters-order-name.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_filters">

      <input
        matInput
        placeholder="Order Name"
        formControlName="orderName"
        autocomplete="off">

    </mat-form-field>
    `
})
export class JobsFiltersOrderNameComponent {
  @Input() fg_filters: FormGroup;
}
