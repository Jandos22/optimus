import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

// rxjs
import { take } from 'rxjs/operators';

// date-fns
import * as startOfToday from 'date-fns/start_of_today';

// servises
import { OrdersService } from '../../../../orders/services';

// interfaces
import { OrdersSearchParams } from '../../../../../shared/interface/orders.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { OrderItem } from './../../../../../shared/interface/orders.model';

@Component({
  selector: 'app-dashboard-orders-expired',
  styleUrls: ['dashboard-orders-expired.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrdersService],
  template: `
    <div class="location-dashboard-message expired"
        *ngIf="expired > 0"
        fxLayout="row nowrap" fxLayoutAlign="start start"
        (click)="navigateToExpiredOrders()"
        matTooltip="Open expired orders">

        <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
            <div class="number" fxFlex="0 0 auto">{{ expired }}</div>
            <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
                <div class="noun">orders</div>
                <div class="verb">expired</div>
            </div>
        </div>
    </div>
  `
})
export class DashboardOrdersExpiredComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  doRefresh: boolean;

  expired: number;
  expiredError: boolean;
  expiredRefreshing: boolean;

  constructor(
    private spHttp: OrdersService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.myLocation && changes.myLocation.currentValue) {
      this.refresh();
    }

    if (changes.doRefresh) {
      this.refresh();
    }
  }

  refresh() {
    // clear numbers
    this.expired = 0;
    // fetch new numbers
    this.getExpiredOrders();
  }

  navigateToExpiredOrders() {
    this.router.navigate([
      '/orders',
      { lastUpdate: 1, locations: [this.myLocation.ID] }
    ]);
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
