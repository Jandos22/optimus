import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders-filters-order-number',
  styleUrls: ['orders-filters-order-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters">

      <input
        matInput
        placeholder="Order Number"
        formControlName="orderNumber"
        autocomplete="off">

    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['orderNumber'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class OrdersFiltersOrderNumberComponent {
  @Input()
  fg_filters: FormGroup;

  reset() {
    this.fg_filters.controls['orderNumber'].reset();
  }
}
