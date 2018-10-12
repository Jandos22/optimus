import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
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
import * as fromPeople from '../../store';
import * as fromRoot from '../../../../store';

// material
import { MatDialog } from '@angular/material';

// interfaces
import {
  PeopleItem,
  UserSearchParams
} from '../../../../shared/interface/people.model';
import { PaginationState } from '../../store/reducers/pagination.reducer';

// form component
import { PeopleFormComponent } from '../../forms/people-form/people-form.component';

// services
import { NotificationsService } from 'angular2-notifications';
import { PeopleUrlParamsService } from '../../services/people-url-params.service';

@Component({
  selector: 'app-people.common-app-v2-container',
  styleUrls: ['./people.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-people-header
      fxFlex="65px"
      class="common-header"
      [appName]="appName"
      [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)"
      (toggleFilters)="toggleFilters()">
    </app-people-header>

    <app-people-content
      fxFlex class="common-content"
      fxLayout="column"
      [data]="data"
      (openUserForm)="openForm('view', $event)">
    </app-people-content>

    <app-people-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination"
      [top]="params.top"
      [searching]="searching"
      (onNext)="onNext()"
      (onBack)="onBack()">
    </app-people-footer>

    <!-- FILTERS -->
    <app-people-filters class="common-filters-container"
      [style.display]="(showFilters ? 'flex' : 'none')"
      fxLayout="column"
      fxLayoutAlign="start start"
      [filterParams]="filterParams"
      (onFiltersUpdate)="onFiltersUpdate($event)"
      (toggleFilters)="toggleFilters()">
    </app-people-filters>

    <simple-notifications [options]="options"></simple-notifications>
  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // app title in header and store.root.apps.name
  appName = 'People';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: PeopleItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: UserSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  url$: Subscription;
  urlParams: any;
  filterParams: UserSearchParams;

  // when showFilters toggle it toggles class in host element
  @HostBinding('class.filtersOpened')
  showFilters = false;

  public options = {
    position: ['middle', 'center'],
    timeOut: 1500,
    animate: 'scale'
  };

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_people: Store<fromPeople.PeopleState>,
    public form: MatDialog,
    private notify: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: PeopleUrlParamsService
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

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

    // main data = array of users
    this.$data = this.store_people
      .pipe(select(fromPeople.selectAllUsers))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_people
      .pipe(select(fromPeople.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_people
      .select(fromPeople.getUsersSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_people
      .select(fromPeople.getParams)
      .subscribe(params => {
        this.params = params;
      });

    // fetch people positions to use in forms
    this.store_root.dispatch(new fromPeople.FetchPeoplePositions());
  }

  onNext() {
    this.store_people.dispatch(
      new fromPeople.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_people.dispatch(
      new fromPeople.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_people.dispatch(new fromPeople.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };

    const formRef = this.form.open(PeopleFormComponent, {
      data,
      disableClose: true,
      autoFocus: false
    });

    formRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        console.log(res);
        if (res && res.result === 'success') {
          this.notify.create('Successfully added', res.data.Alias, 'success');

          // immediately scroll down when new user added
          // document
          //   .querySelector('app-people-content.common-content')
          //   .scrollTo(
          //     0,
          //     document.querySelector('app-people-content.common-content')
          //       .scrollHeight
          //   );
        }
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

  onFiltersUpdate(params: UserSearchParams) {
    console.log('ON FILTERS UPDATE');
    console.log('old params:');
    console.log(this.params);
    console.log('new params:');
    console.log(params);
    this.updateUrl(params);
  }

  updateUrl(params: UserSearchParams) {
    console.log('UPDATE URL');
    const link = ['./people', { ...this.urlService.removeEmptyKeys(params) }];
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
