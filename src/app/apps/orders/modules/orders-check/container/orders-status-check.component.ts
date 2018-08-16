import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { take } from 'rxjs/operators';

import * as startOfToday from 'date-fns/start_of_today';

import { OrdersService } from '../../../services';

import { OrdersSearchParams } from '../../../../../shared/interface/orders.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { OrderItem } from './../../../../../shared/interface/orders.model';

@Component({
  selector: 'app-orders-status-check',
  styleUrls: ['orders-status-check.component.scss'],
  template: `
    <button *ngIf="!expiredError && !expiredRefreshing"
        mat-button color="accent"
        class='status-check-button accent' matTooltip='Expired Orders'
        fxLayout="row" fxLayoutAlign="center center">
        <div class="accent">{{ expired }}</div>
    </button>

    <button mat-button color="primary" matTooltip='Refresh Status'
        class='status-check-button'
        fxLayout="row" fxLayoutAlign="center center"
        (click)="refresh()">
        <fa-icon [icon]="['fas', 'sync-alt']" [spin]="expiredRefreshing"></fa-icon>
    </button>
  `
})
export class OrdersStatusCheckComponent implements OnInit {
  @Input()
  myLocation: LocationEnt;

  expired: number;
  expiredError: boolean;
  expiredRefreshing: boolean;

  constructor(
    private spHttp: OrdersService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    // clear numbers
    this.expired = 0;
    // fetch new numbers
    this.getExpiredOrders();
  }

  getExpiredOrders() {
    this.expiredRefreshing = true;
    this.expiredError = false;

    // compose params to get only expired HARCs
    const params: OrdersSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      lastUpdate: 1
    };

    // build url with given params
    const url = this.spHttp.buildUrl(params);

    // subscribe and autocomplete request to server
    this.spHttp
      .getData(url)
      .pipe(take(1))
      .subscribe(success => this.getExpiredOrdersSuccess(success));
  }

  getExpiredOrdersSuccess(orders: OrderItem[]) {
    console.log('got expired orders: ' + orders.length);

    this.expired = orders.length;

    this.expiredRefreshing = false;
    this.expiredError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getExpiredOrdersError(error) {
    this.expiredRefreshing = false;
    this.expiredError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }
}
