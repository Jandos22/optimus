import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';
import * as application from '../../../../store/actions/apps.actions';

// rxjs
import { Subscription, Observable } from 'rxjs';

// interfaces
import {
  TimelineSearchParams,
  TimelineEventItem
} from '../../../../shared/interface/timeline.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';

@Component({
  selector: 'app-timeline.common-flex-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-timeline-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching">
    </app-timeline-header>

    <app-timeline-events-list
      fxFlex class="common-content"
      [events]="data">
    </app-timeline-events-list>

    <app-timeline-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-timeline-footer>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  appName = 'Timeline';

  $data: Subscription;
  data: TimelineEventItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: TimelineSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new application.SetAppName(this.appName));

    // main data = array of events
    this.$data = this.store_timeline
      .pipe(select(fromTimeline.selectAllEvents))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_timeline
      .pipe(select(fromTimeline.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_timeline
      .select(fromTimeline.getEventsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_timeline
      .select(fromTimeline.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_timeline.dispatch(
      new fromTimeline.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_timeline.dispatch(
      new fromTimeline.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_timeline.dispatch(new fromTimeline.BeginCount(params));
    }
  }

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
