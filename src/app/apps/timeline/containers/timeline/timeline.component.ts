import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';

// router
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

// lodash
import * as _ from 'lodash';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromTimeline from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { TimelineFormComponent } from '../../forms';

// interfaces
import {
  TimelineSearchParams,
  TimelineEventItem
} from '../../../../shared/interface/timeline.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';

// services
import { TimelineUrlParamsService } from '../../services/timeline-url-params.service';

@Component({
  selector: 'app-timeline.common-app-v2-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- CONTENT -->

    <app-timeline-header
      fxFlex="65px"
      class="common-header"
      [appName]="appName"
      [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)"
      (toggleFilters)="toggleFilters()">
    </app-timeline-header>

    <app-timeline-content
      fxFlex class="common-content"
      [events]="data"
      (openForm)="openForm('view', $event)">
    </app-timeline-content>

    <app-timeline-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination"
      [top]="params.top"
      [searching]="searching"
      (onNext)="onNext()"
      (onBack)="onBack()">
    </app-timeline-footer>

    <!-- FILTERS -->
    <app-timeline-filters class="common-filters-container"
      [style.display]="(showFilters ? 'flex' : 'none')"
      fxLayout="column"
      fxLayoutAlign="start start"
      [filterParams]="filterParams"
      (onFiltersUpdate)="onFiltersUpdate($event)"
      (toggleFilters)="toggleFilters()">
    </app-timeline-filters>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  appName = 'Timeline';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: TimelineEventItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: TimelineSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  url$: Subscription;
  urlParams: any;
  filterParams: TimelineSearchParams;

  // when showFilters toggle it toggles class in host element
  @HostBinding('class.filtersOpened')
  showFilters = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_timeline: Store<fromTimeline.TimelineState>,
    public form: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: TimelineUrlParamsService
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    // fetch Event Types list from database
    this.store_root.dispatch(new fromTimeline.FetchEventTypesStart());

    // subscription should get url params
    // then should compose urlParams
    // - that will get passed to child filters component
    // - that will be used to update store.params
    this.url$ = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          return params.keys
            ? this.urlService.composeFilterParamsFromUrlParams(params)
            : null;
        })
      )
      .subscribe(params => {
        console.log(params);
        this.filterParams = { ...params };
      });

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

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

  openForm(mode, item?): void {
    const data = { mode, item };

    const formRef = this.form.open(TimelineFormComponent, {
      data,
      disableClose: true,
      autoFocus: false
    });

    formRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
      });
  }

  toggleFilters() {
    console.log(this.showFilters);
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
    console.log(this.showFilters);
  }

  onFiltersUpdate(params: TimelineSearchParams) {
    console.log('ON FILTERS UPDATE');
    console.log('old params:');
    console.log(this.params);
    console.log('new params:');
    console.log(params);
    this.updateUrl(params);
  }

  updateUrl(params: TimelineSearchParams) {
    console.log('UPDATE URL');
    const link = ['./timeline', { ...this.urlService.removeEmptyKeys(params) }];
    console.log(link);
    this.router.navigate(link);
  }

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
    this.url$.unsubscribe();
  }
}
