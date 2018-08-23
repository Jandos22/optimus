import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
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

// services
import { ExemptionsService } from '../../../../exemptions/services';

// interfaces
import { ExemptionsSearchParams } from '../../../../../shared/interface/exemptions.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { ExemptionItem } from './../../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-dashboard-exemptions-expired',
  styleUrls: ['dashboard-exemptions-expired.component.scss'],
  template: `
    <div class="location-dashboard-message expired"
      *ngIf="expired > 0"
      fxLayout="row nowrap" fxLayoutAlign="start start"
      (click)="navigateToExpiredExemptions()"
      matTooltip="Open expired exemptions">

      <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
        <div class="number" fxFlex="0 0 auto">{{ expired }}</div>
        <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
            <div class="noun">exemptions</div>
            <div class="verb">expired</div>
        </div>
      </div>
    </div>
  `
})
export class DashboardExemptionsExpiredComponent implements OnInit, OnChanges {
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
    private spHttp: ExemptionsService,
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
    this.getExpiredExemptions();
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
    this.expired = exemptions.length;

    if (this.expired > 0) {
      this.onHaveChange(true);
    }

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

  onHaveChange(value: boolean) {
    this.onHaveNotifications.emit({
      app: 'exemptions',
      what: 'Expired',
      value: value
    });
  }
}
