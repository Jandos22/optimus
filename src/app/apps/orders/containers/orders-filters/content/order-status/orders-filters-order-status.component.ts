import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
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
  selector: 'app-orders-filters-order-status',
  styleUrls: ['orders-filters-order-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters" class="forFilters">

      <mat-select placeholder="Order Status" [formControlName]="'orderStatus'">

        <mat-option *ngFor="let status of orderStatuses" [value]="status.Id">{{ status.Title }}</mat-option>

      </mat-select>

    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['orderStatus'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class OrdersFiltersOrderStatusComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input()
  fg_filters: FormGroup;

  // @Input() initStatusWith: string;

  @Input()
  doReset: boolean;

  @Input()
  orderStatuses: OrderStatus[];

  // harcStatus: FormControl;

  // status$: Observable<string[]>;

  // $status: Subscription;

  constructor() {}

  ngOnInit() {
    // this.initFormControl(this.initStatusWith);
    // this.startObservables();
    // this.startSubscriptions();
  }

  ngOnDestroy() {
    // this.$status.unsubscribe();
  }

  reset() {
    this.fg_filters.controls['orderStatus'].reset();
  }

  // initFormControl(status: string) {
  //   status = status ? status : '';
  //   this.harcStatus = new FormControl(status);
  // }

  // startObservables() {
  //   this.status$ = this.harcStatus.valueChanges;
  // }

  // startSubscriptions() {
  //   // subscribe to local form control
  //   this.$status = this.status$.subscribe((status: string[]) => {
  //     console.log(status);
  //     this.fg_filters.controls['status'].patchValue(status);
  //   });
  // }

  // showNotOkHarcs() {
  //   const notOk = ['Pending', 'Expired', 'Soon Expire'];
  //   this.fg_filters.controls['status'].patchValue(notOk);
  //   this.harcStatus.patchValue(notOk);
  // }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.doReset) {
    //   if (changes.doReset.currentValue) {
    //     console.log('reset');
    //     if (changes.doReset.currentValue !== changes.doReset.previousValue) {
    //       this.harcStatus.patchValue('');
    //     }
    //   }
    // }
  }
}
