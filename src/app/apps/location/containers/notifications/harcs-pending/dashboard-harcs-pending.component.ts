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
import { HarcsService } from '../../../../harcs/services';

// interfaces
import { HarcsSearchParams } from '../../../../../shared/interface/harcs.model';
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { HarcItem } from './../../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-dashboard-harcs-pending',
  styleUrls: ['dashboard-harcs-pending.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [HarcsService],
  template: `
    <div class="location-dashboard-message pending"
        *ngIf="pending > 0"
        fxLayout="row nowrap" fxLayoutAlign="start start"
        (click)="navigateToPendingHarcs()"
        matTooltip="Open pending HARCs">

      <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
        <div class="number" fxFlex="0 0 auto">{{ pending }}</div>
        <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
          <div class="noun">harcs</div>
          <div class="verb">pending</div>
        </div>
      </div>
    </div>
  `
})
export class DashboardHarcsPendingComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  doRefresh: boolean;

  pending: number;
  pendingError: boolean;
  pendingRefreshing: boolean;

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
    this.pending = 0;
    // fetch new numbers
    this.getPendingHarcs();
  }

  getPendingHarcs() {
    this.pendingRefreshing = true;
    this.pendingError = false;

    // compose params to get only expired HARCs
    const params: HarcsSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      status: ['Pending']
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
}
