import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';
import * as application from '../../../../store/actions/apps.actions';

// rxjs
import { Subscription, Observable } from 'rxjs';

// interfaces
import { PaginationIndexes } from '../../../../shared/interface/pagination.model';
import {
  TimelineEventsParams,
  TimelineEventItem
} from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline.common-flex-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-timeline-header
      fxFlex="65px" class="common-header"
      [appName]="appName">
    </app-timeline-header>

    <app-timeline-events-list
      fxFlex class="common-content"
      [events]="data">
    </app-timeline-events-list>

    <app-timeline-footer fxFlex="49px" class="common-footer"
      [indexes]="indexes" [totalDisplayed]="totalDisplayed"
      [from]="from" [to]="to" [totalFound]="totalFound$ | async"
      (onNext)="onNext($event)" (onBack)="onBack($event)">
    </app-timeline-footer>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  appName = 'Timeline';

  // data
  data$: Subscription;
  data: TimelineEventItem[];

  // pagination
  calcFromToTotal$: Subscription;
  total: any;

  totalFound$: Observable<number | string>;
  totalDisplayed: number;

  from: number;
  to: number;

  indexes$: Subscription;
  indexes: PaginationIndexes;

  links$: Subscription;
  links: string[];

  // params
  params$: Subscription;
  params: TimelineEventsParams;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>
  ) {}

  ngOnInit() {
    this.store_root.dispatch(new application.SetAppName(this.appName));

    // main data = array of users
    this.data$ = this.store_timeline
      .pipe(select(fromTimeline.selectAllEvents))
      .subscribe(data => {
        // goes in people-list component
        this.data = data;
        // count total
        // this.countTotalItems(this.params);
      });

    this.params$ = this.store_timeline
      .select(fromTimeline.getParams)
      .subscribe(params => {
        this.params = params;
      });

    this.calcFromToTotal$ = this.store_timeline
      .pipe(select(fromTimeline.selectTotalDisplayedEvents))
      .subscribe(totalDisplayed => {
        console.log('total displayed: ' + totalDisplayed);
        this.totalDisplayed = totalDisplayed;
        console.log(this.indexes);
        if (this.indexes.current) {
          this.from = this.indexes.current * this.params.top + 1;
          this.to = this.from + this.totalDisplayed - 1;
        }
      });

    this.totalFound$ = this.store_timeline.select(fromTimeline.getTotalFound);

    // subscribe to indexes
    this.indexes$ = this.store_timeline
      .select(fromTimeline.getPageIndexes)
      .subscribe(indexes => {
        console.log('indexes:');
        console.log(this.indexes);
        this.indexes = indexes;
      });

    // subscribe to search pagelinks
    this.links$ = this.store_timeline
      .select(fromTimeline.getPageLinks)
      .subscribe(links => {
        this.links = links;
      });
  }

  onNext(indexes: PaginationIndexes) {
    this.store_timeline.dispatch(
      new fromTimeline.OnNext(this.links[indexes.next])
    );
  }

  onBack(indexes: PaginationIndexes) {
    this.store_timeline.dispatch(
      new fromTimeline.OnBack(this.links[indexes.previous])
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_timeline.dispatch(new fromTimeline.BeginCount(params));
    }
  }

  ngOnDestroy() {
    this.data$.unsubscribe();
    this.indexes$.unsubscribe();
    this.calcFromToTotal$.unsubscribe();
    this.params$.unsubscribe();
    this.links$.unsubscribe();
  }
}
