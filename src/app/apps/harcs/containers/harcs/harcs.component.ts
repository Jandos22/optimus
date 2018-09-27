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
import * as fromHarcs from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { HarcsFormComponent } from '../../forms';

// interfaces
import {
  HarcsSearchParams,
  HarcItem
} from '../../../../shared/interface/harcs.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';

// services
import { HarcsUrlParamsService } from '../../services/harcs-url-params.service';

@Component({
  selector: 'app-harcs.common-app-v2-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-harcs-header
      fxFlex="65px"
      class="common-header"
      [appName]="appName"
      [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)"
      (toggleFilters)="toggleFilters()">
    </app-harcs-header>

    <app-harcs-list
      fxFlex
      class="common-content"
      [harcs]="data"
      (openForm)="openForm('view', $event)">
    </app-harcs-list>

    <app-harcs-footer
      fxFlex="49px"
      class="common-footer"
      [pagination]="pagination"
      [top]="params.top"
      [searching]="searching"
      (onNext)="onNext()"
      (onBack)="onBack()">
    </app-harcs-footer>

    <!-- FILTERS -->
    <app-harcs-filters
      class="common-filters-container"
      [style.display]="(showFilters ? 'flex' : 'none')"
      fxLayout="column"
      fxLayoutAlign="start start"
      [filterParams]="filterParams"
      (onFiltersUpdate)="onFiltersUpdate($event)"
      (toggleFilters)="toggleFilters()">
    </app-harcs-filters>
  `,
  styleUrls: ['./harcs.component.scss']
})
export class HarcsComponent implements OnInit, OnDestroy {
  appName = 'HARCs';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: HarcItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: HarcsSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  url$: Subscription;
  urlParams: any;
  filterParams: HarcsSearchParams;

  // when showFilters toggle it toggles class in host element
  @HostBinding('class.filtersOpened')
  showFilters = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_harcs: Store<fromHarcs.HarcsState>,
    public form: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: HarcsUrlParamsService
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

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

    // main data = array of harcs
    this.$data = this.store_harcs
      .pipe(select(fromHarcs.selectAllHarcs))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_harcs
      .pipe(select(fromHarcs.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_harcs
      .select(fromHarcs.getHarcsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_harcs
      .select(fromHarcs.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_harcs.dispatch(
      new fromHarcs.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_harcs.dispatch(
      new fromHarcs.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_harcs.dispatch(new fromHarcs.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(HarcsFormComponent, {
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
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }

  onFiltersUpdate(params: HarcsSearchParams) {
    console.log('ON FILTERS UPDATE');
    console.log('old params:');
    console.log(this.params);
    console.log('new params:');
    console.log(params);
    this.updateUrl(params);
  }

  updateUrl(params: HarcsSearchParams) {
    console.log('UPDATE URL');
    const link = ['./harcs', { ...this.urlService.removeEmptyKeys(params) }];
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
