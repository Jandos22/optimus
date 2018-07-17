import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { take } from 'rxjs/operators';

import * as startOfToday from 'date-fns/start_of_today';

import { HarcsService } from '../../../services';

import { HarcsSearchParams } from '../../../../../shared/interface/harcs.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { HarcItem } from './../../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-harcs-status-check',
  styleUrls: ['harcs-status-check.component.scss'],
  template: `
    <button *ngIf="pending && !pendingRefreshing && !pendingError && !expiredError"
        mat-button color="accent"
        class='status-check-button accent' matTooltip='Pending HARCs'
        fxLayout="row" fxLayoutAlign="center center">
        <div class="accent">{{ pending }}</div>
    </button>

    <button *ngIf="expired && !expiredRefreshing && !pendingError && !expiredError"
        mat-button color="warn"
        class='status-check-button warn' matTooltip='Expired HARCs'
        fxLayout="row" fxLayoutAlign="center center">
        <div class="warn">{{ expired }}</div>
    </button>

    <button mat-button color="primary" matTooltip='Refresh Status'
        class='status-check-button'
        fxLayout="row" fxLayoutAlign="center center"
        (click)="refresh()">
        <fa-icon [icon]="['fas', 'sync-alt']" [spin]="pendingRefreshing || expiredRefreshing"></fa-icon>
    </button>
  `
})
export class HarcsStatusCheckComponent implements OnInit {
  @Input() myLocation: LocationEnt;

  pending: number;
  expired: number;

  pendingError: boolean;
  expiredError: boolean;

  pendingRefreshing: boolean;
  expiredRefreshing: boolean;

  constructor(
    private spHttp: HarcsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    // clear numbers
    this.pending = 0;
    this.expired = 0;
    // fetch new numbers
    this.getExpiredHarcs();
    this.getPendingHarcs();
  }

  getPendingHarcs() {
    this.pendingRefreshing = true;
    this.pendingError = false;

    // compose params to get only expired HARCs
    const params: HarcsSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 99,
      status: 'Pending'
    };

    // build url with given params
    const url = this.spHttp.buildUrl(params);

    // subscribe and autocomplete request to server
    this.spHttp
      .getData(url)
      .pipe(take(1))
      .subscribe(success => this.getPendingHarcsSuccess(success));
  }

  getPendingHarcsSuccess(harcs: HarcItem[]) {
    console.log('got pending harcs: ' + harcs.length);

    this.pending = harcs.length;

    this.pendingRefreshing = false;
    this.pendingError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getPendingHarcsError(error) {
    this.pendingRefreshing = false;
    this.pendingError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getExpiredHarcs() {
    this.expiredRefreshing = true;
    this.expiredError = false;

    // compose params to get only expired HARCs
    const params: HarcsSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      status: 'Approved',
      beforeDate: startOfToday()
    };

    // build url with given params
    const url = this.spHttp.buildUrl(params);

    // subscribe and autocomplete request to server
    this.spHttp
      .getData(url)
      .pipe(take(1))
      .subscribe(success => this.getExpiredHarcsSuccess(success));
  }

  getExpiredHarcsSuccess(harcs: HarcItem[]) {
    console.log('got expired harcs: ' + harcs.length);

    this.expired = harcs.length;

    this.expiredRefreshing = false;
    this.expiredError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getExpiredHarcsError(error) {
    this.expiredRefreshing = false;
    this.expiredError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }
}
