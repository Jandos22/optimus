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
  selector: 'app-dashboard-issues-open',
  styleUrls: ['dashboard-issues-open.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimelineService],
  template: `
    <div class="location-dashboard-message issueOpen"
        *ngIf="issueOpen > 0"
        fxLayout="row nowrap" fxLayoutAlign="start start"
        (click)="navigateToOpenIssues()"
        matTooltip="Show open issues">

        <div fxFlex class="message" fxLayout="row nowrap" fxLayoutAlign="start start">
            <div class="number" fxFlex="0 0 auto">{{ issueOpen }}</div>
            <div class="text" fxFlex="1 0 auto" fxLayout="column" fxLayoutAlign="center start">
                <div class="noun">issues</div>
                <div class="verb">open</div>
            </div>
        </div>
    </div>
  `
})
export class DashboardIssuesOpenComponent implements OnInit, OnChanges {
  @Input()
  myLocation: LocationEnt;

  @Input()
  doRefresh: boolean;

  @Output()
  onHaveNotifications = new EventEmitter<any>();

  issueOpen: number;
  issueOpenError: boolean;
  issueOpenRefreshing: boolean;

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
    this.issueOpen = 0;
    this.onHaveChange(false);

    // fetch new numbers
    this.getIssuesOpen();
  }

  navigateToOpenIssues() {
    this.router.navigate([
      '/timeline',
      {
        eventType: 'Issue',
        issueState: 'Open',
        locations: [this.myLocation.ID]
      }
    ]);
  }

  getIssuesOpen() {
    this.issueOpenRefreshing = true;
    this.issueOpenError = false;

    // compose params to get only Events with open issues
    const params: TimelineSearchParams = {
      text: '',
      locations: [this.myLocation.ID],
      top: 500,
      eventType: 'Issue',
      issueState: 'Open'
    };

    // build url with given params
    const url = this.spHttp.buildUrl(params);

    // subscribe and autocomplete request to server
    this.spHttp
      .getData(url)
      .pipe(take(1))
      .subscribe(success => this.getIssuesOpenSuccess(success));
  }

  getIssuesOpenSuccess(events: TimelineEventItem[]) {
    this.issueOpen = events.length;

    if (this.issueOpen > 0) {
      this.onHaveChange(true);
    }

    this.issueOpenRefreshing = false;
    this.issueOpenError = false;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  getIssuesOpenError(error) {
    this.issueOpenRefreshing = false;
    this.issueOpenError = true;

    // trigger change detection manually to update view
    this.changeDetectorRef.detectChanges();
  }

  onHaveChange(value: boolean) {
    this.onHaveNotifications.emit({
      app: 'timeline',
      what: 'IssuesOpen',
      value: value
    });
  }
}
