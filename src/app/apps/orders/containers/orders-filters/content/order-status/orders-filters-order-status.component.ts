import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from "@angular/core";
import { FormGroup } from "@angular/forms";

import * as _ from "lodash";

// interfaces
import { OrderStatus } from "../../../../../../shared/interface/orders.model";

@Component({
  selector: "app-orders-filters-order-status",
  styleUrls: ["orders-filters-order-status.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters" class="forFilters">
      <mat-select placeholder="Order Status" [formControlName]="'orderStatus'">
        <mat-option *ngFor="let status of orderStatuses" [value]="status.Id">{{
          status.Title
        }}</mat-option>
      </mat-select>
    </mat-form-field>

    <!-- RESET BUTTON -->
    <div
      class="quick-filter-button"
      *ngIf="this.fg_filters.controls['orderStatus'].value"
      fxLayout="row nowrap"
      fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'"
      (click)="reset()"
    >
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
  `
})
export class OrdersFiltersOrderStatusComponent implements OnInit {
  @Input()
  fg_filters: FormGroup;

  // @Input() initStatusWith: string;

  @Input()
  doReset: boolean;

  @Input()
  orderStatuses: OrderStatus[];

  constructor() {}

  ngOnInit() {}

  reset() {
    this.fg_filters.controls["orderStatus"].reset();
  }
}
