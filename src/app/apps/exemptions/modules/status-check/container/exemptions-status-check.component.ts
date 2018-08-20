import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { take } from 'rxjs/operators';

import * as startOfToday from 'date-fns/start_of_today';

import { ExemptionsService } from '../../../services';

import { ExemptionsSearchParams } from '../../../../../shared/interface/exemptions.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { ExemptionItem } from './../../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-status-check',
  styleUrls: ['exemptions-status-check.component.scss'],
  template: `
    <button *ngIf="pending && !pendingRefreshing && !pendingError && !expiredError"
        mat-button color="accent"
        class='status-check-button accent' matTooltip='Pending Exemptions'
        fxLayout="row" fxLayoutAlign="center center">
        <div class="accent">{{ pending }}</div>
    </button>

    <button *ngIf="expired && !expiredRefreshing && !pendingError && !expiredError"
        mat-button color="warn"
        class='status-check-button warn' matTooltip='Expired Exemptions'
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
export class ExemptionsStatusCheckComponent implements OnInit {
  @Input()
  myLocation: LocationEnt;

  pending: number;
  expired: number;

  pendingError: boolean;
  expiredError: boolean;

  pendingRefreshing: boolean;
  expiredRefreshing: boolean;

  constructor(
    private spHttp: ExemptionsService,
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
    this.getExpiredExemptions();
    this.getPendingExemptions();
  }

  getPendingExemptions() {
    this.pendingRefreshing = true;
    this.pendingError = false;

    // compose params to get only expired Exemptions
    const params: ExemptionsSearchParams = {
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
      .subscribe(success => this.getPendingExemptionsSuccess(success));
  }

  getPendingExemptionsSuccess(exemptions: ExemptionItem[]) {
    // console.log('got pending exemptions: ' + exemptions.length);

    this.pending = exemptions.length;

    this.pendingRefreshing = false;
    this.pendingError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getPendingExemptionsError(error) {
    this.pendingRefreshing = false;
    this.pendingError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getExpiredExemptions() {
    this.expiredRefreshing = true;
    this.expiredError = false;

    // compose params to get only expired Exemptions
    const params: ExemptionsSearchParams = {
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
      .subscribe(success => this.getExpiredExemptionsSuccess(success));
  }

  getExpiredExemptionsSuccess(exemptions: ExemptionItem[]) {
    // console.log('got expired exemptions: ' + exemptions.length);

    this.expired = exemptions.length;

    this.expiredRefreshing = false;
    this.expiredError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getExpiredExemptionsError(error) {
    this.expiredRefreshing = false;
    this.expiredError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }
}
