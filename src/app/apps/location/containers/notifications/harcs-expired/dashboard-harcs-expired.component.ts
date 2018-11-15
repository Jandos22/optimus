import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
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
import { HarcsService } from '../../../../harcs/services';

// interfaces
import { HarcsSearchParams } from '../../../../../shared/interface/harcs.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { HarcItem } from './../../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-dashboard-harcs-expired',
  styleUrls: ['dashboard-harcs-expired.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HarcsService],
  template: `
    <div class="location-dashboard-message expired"
        *ngIf="expired > 0"
        fxLayout="row nowrap" fxLayoutAlign="start start"
        (click)="navigateToExpiredHarcs()"
        matTooltip="Open expired or soon expire HARCs">

      <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
        <div class="number" fxFlex="0 0 auto">{{ expired }}</div>
        <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
          <div class="noun">harcs</div>
          <div class="verb">expired or soon expire</div>
        </div>
      </div>
    </div>
  `
})
export class DashboardHarcsExpiredComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  doRefresh: boolean;

  @Output()
  onHaveNotifications = new EventEmitter<any>();

  expired: number;
  expiredError: boolean;
  expiredRefreshing: boolean;

  constructor(
    private spHttp: HarcsService,
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
    this.onHaveChange(false);
    // fetch new numbers
    this.getExpiredHarcs();
  }

  navigateToExpiredHarcs() {
    this.router.navigate([
      '/harcs',
      {
        status: ['Expired', 'Soon Expire'],
        locations: [this.myLocation.ID]
      }
    ]);
  }

  getExpiredHarcs() {
    this.expiredRefreshing = true;
    this.expiredError = false;

    // compose params to get only expired HARCs
    const params: HarcsSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      status: ['Expired', 'Soon Expire']
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
    this.expired = harcs.length;

    if (this.expired > 0) {
      this.onHaveChange(true);
    }

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

  onHaveChange(value: boolean) {
    this.onHaveNotifications.emit({
      app: 'harcs',
      what: 'Expired',
      value: value
    });
  }
}
