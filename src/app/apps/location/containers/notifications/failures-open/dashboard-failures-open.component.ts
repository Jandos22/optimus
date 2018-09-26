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
import { TimelineService } from '../../../../timeline/services';

// interfaces
import { LocationEnt } from '../../../../../shared/interface/locations.model';
import { TimelineEventItem } from './../../../../../shared/interface/timeline.model';
import { TimelineSearchParams } from '../../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-dashboard-failures-open',
  styleUrls: ['../../dashboard/location-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimelineService],
  template: `
    <div class="location-dashboard-message failuresOpen"
        *ngIf="failuresOpen > 0"
        fxLayout="row nowrap" fxLayoutAlign="start start"
        (click)="navigateToOpenFailures()"
        matTooltip="Show open failures">

        <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
            <div class="number" fxFlex="0 0 auto">{{ failuresOpen }}</div>
            <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
                <div class="noun">failures</div>
                <div class="verb">open</div>
            </div>
        </div>
    </div>
  `
})
export class DashboardFailuresOpenComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  doRefresh: boolean;

  @Output()
  onHaveNotifications = new EventEmitter<any>();

  failuresOpen: number;
  failuresOpenError: boolean;
  failuresOpenRefreshing: boolean;

  constructor(
    private spHttp: TimelineService,
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
    this.failuresOpen = 0;
    this.onHaveChange(false);

    // fetch new numbers
    this.getFailuresOpen();
  }

  navigateToOpenFailures() {
    this.router.navigate([
      '/timeline',
      {
        eventType: 'Failure',
        issueState: 'Open',
        locations: [this.myLocation.ID]
      }
    ]);
  }

  getFailuresOpen() {
    this.failuresOpenRefreshing = true;
    this.failuresOpenError = false;

    // compose params to get only Events with open failuress
    const params: TimelineSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      eventType: 'Failure',
      issueState: 'Open'
    };

    // build url with given params
    const url = this.spHttp.buildUrl(params);

    // subscribe and autocomplete request to server
    this.spHttp
      .getData(url)
      .pipe(take(1))
      .subscribe(success => this.getFailuresOpenSuccess(success));
  }

  getFailuresOpenSuccess(events: TimelineEventItem[]) {
    this.failuresOpen = events.length;

    if (this.failuresOpen > 0) {
      this.onHaveChange(true);
    }

    this.failuresOpenRefreshing = false;
    this.failuresOpenError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getFailuressOpenError(error) {
    this.failuresOpenRefreshing = false;
    this.failuresOpenError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  onHaveChange(value: boolean) {
    this.onHaveNotifications.emit({
      app: 'timeline',
      what: 'FailuresOpen',
      value: value
    });
  }
}
