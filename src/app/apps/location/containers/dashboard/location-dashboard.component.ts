import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { DashboardOrdersExpiredComponent } from '..';

@Component({
  selector: 'app-location-dashboard',
  styleUrls: ['location-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-header" fxLayout="row nowrap" fxLayoutAlign="space-between start">
        <div class="title">notifications</div>
        <div class="refresh" (click)="onRefresh()">refresh</div>
    </div>

    <div class="dashboard-all-good"
        *ngIf="AllGood"
        fxLayout="row nowrap">

        <div fxFlex="16px" class="icon">
            <fa-icon [icon]="['fas', 'check-circle']"></fa-icon>
        </div>
        <div>location has no issues</div>
    </div>

    <app-dashboard-issues-open
        *ngIf="timelineUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-issues-open>

    <app-dashboard-failures-open
        *ngIf="timelineUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-failures-open>

    <app-dashboard-orders-expired
        *ngIf="ordersUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-orders-expired>

    <app-dashboard-harcs-expired
        *ngIf="harcsUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-harcs-expired>

    <app-dashboard-harcs-pending
        *ngIf="harcsUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-harcs-pending>

    <app-dashboard-exemptions-expired
        *ngIf="exemptionsUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-exemptions-expired>

    <app-dashboard-exemptions-pending
        *ngIf="exemptionsUsed"
        [myLocation]="myLocation"
        [doRefresh]="refresh"
        (onHaveNotifications)="onHaveNotifications($event)">
    </app-dashboard-exemptions-pending>
    `
})
export class LocationDashboardComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  notifications = 0;

  refresh: boolean;

  // these boolean values define
  // which cards to use for checking
  timelineUsed: boolean; // id 1
  ordersUsed: boolean; // id 7
  harcsUsed: boolean; // id 4
  exemptionsUsed: boolean; // 3

  // these boolean values define
  // which application has notifications
  timelineHaveIssuesOpen: boolean;
  timelineHaveFailuresOpen: boolean;
  ordersHaveExpired: boolean;
  harcsHaveExpired: boolean;
  harcsHavePending: boolean;
  exemptionsHaveExpired: boolean;
  exemptionsHavePending: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.myLocation && changes.myLocation.currentValue) {
      this.checkAppsInUse(changes.myLocation.currentValue);
    }
  }

  onRefresh() {
    // console.log(this.refresh);
    this.refresh = this.refresh ? false : true;
    console.log(this.refresh);
  }

  checkAppsInUse(location: LocationEnt) {
    const appIds = location.ApplicationsInUseId.results;

    this.timelineUsed =
      _.find(appIds, (id: number) => id === 2) > 0 ? true : false;

    this.ordersUsed =
      _.find(appIds, (id: number) => id === 7) > 0 ? true : false;

    this.harcsUsed =
      _.find(appIds, (id: number) => id === 4) > 0 ? true : false;

    this.exemptionsUsed =
      _.find(appIds, (id: number) => id === 3) > 0 ? true : false;
  }

  onHaveNotifications(event: { app: string; what: string; value: boolean }) {
    this[`${event.app}Have${event.what}`] = event.value;
  }

  get AllGood() {
    return !this.timelineHaveIssuesOpen &&
      !this.timelineHaveFailuresOpen &&
      !this.ordersHaveExpired &&
      !this.harcsHaveExpired &&
      !this.harcsHavePending &&
      !this.exemptionsHaveExpired &&
      !this.exemptionsHavePending
      ? true
      : false;
  }
}
