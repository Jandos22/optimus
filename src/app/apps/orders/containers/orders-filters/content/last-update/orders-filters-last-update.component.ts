import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';

import * as startOfToday from 'date-fns/start_of_today';
import * as endOfToday from 'date-fns/end_of_today';
import * as addDays from 'date-fns/add_days';

// interfaces
import { FormMode } from '../../../../../../shared/interface/form.model';
import { Observable, Subscription } from 'rxjs';
import { OrderStatus } from '../../../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-filters-last-update',
  styleUrls: ['orders-filters-last-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters" class="forFilters">

      <mat-select placeholder="Status Check" [formControlName]="'lastUpdate'">

        <mat-option [value]="1">Need status check</mat-option>
        <mat-option [value]="2">Recently updated</mat-option>
        <mat-option [value]="3">No LastUpdate flag</mat-option>

      </mat-select>

    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['lastUpdate'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class OrdersFiltersLastUpdateComponent {
  @Input()
  fg_filters: FormGroup;

  constructor() {}

  reset() {
    this.fg_filters.controls['lastUpdate'].reset();
  }
}
