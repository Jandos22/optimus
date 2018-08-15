import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orders-filters-part-number',
  styleUrls: ['orders-filters-part-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_filters">

      <input
        matInput
        placeholder="Part Number"
        formControlName="partNumber"
        autocomplete="off">

    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['partNumber'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class OrdersFiltersPartNumberComponent {
  @Input()
  fg_filters: FormGroup;

  reset() {
    this.fg_filters.controls['partNumber'].reset();
  }
}
