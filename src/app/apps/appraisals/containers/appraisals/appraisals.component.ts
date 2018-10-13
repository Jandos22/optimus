import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';

import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromAppraisals from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { AppraisalsFormComponent } from '../../forms';

// interfaces
import {
  AppraisalsSearchParams,
  AppraisalItem
} from '../../../../shared/interface/appraisals.model';
import { PaginationState } from '../../store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';
import { AppraisalRights } from '../../store';

@Component({
  selector: 'app-appraisals.common-app-v2-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-appraisals-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      [currentUser]="user$ | async"
      [position]="position$ | async"
      (openForm)="openForm('new', $event)"
      (toggleFilters)="toggleFilters()">
    </app-appraisals-header>

    <app-appraisals-list
      fxFlex class="common-content"
      [appraisalGroups]="(appraisalGroups$ | async)" (openForm)="openForm('view', $event)"
      [position]="position$ | async">
    </app-appraisals-list>

    <app-appraisals-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-appraisals-footer>

    <!-- FILTERS -->
    <app-appraisals-filters class="common-filters-container"
      [style.display]="(showFilters ? 'flex' : 'none')"
      fxLayout="column" fxLayoutAlign="start start"
      [currentUser]="user$ | async"
      [position]="position$ | async"
      (toggleFilters)="toggleFilters()">
    </app-appraisals-filters>
  `,
  styleUrls: ['./appraisals.component.scss']
})
export class AppraisalsComponent implements OnInit, OnDestroy {
  appName = 'Appraisals';

  user$: Observable<PeopleItem>;

  $appraisals: Subscription;

  appraisalGroups$: Observable<AppraisalGroupItem[]>;
  data: AppraisalGroupItem[];

  position$: Observable<AppraisalRights>;

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: AppraisalsSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  // when showFilters toggle it toggles class in host element
  @HostBinding('class.filtersOpened')
  showFilters = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_appraisals: Store<fromAppraisals.AppraisalsState>,
    public form: MatDialog
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(
      select(fromRoot.getUserOptimus),
      // when current optimus user object arrives
      // check his/her rights for appraisals
      tap((user: PeopleItem) => {
        this.store_appraisals.dispatch(
          new fromAppraisals.CheckRights(user.PositionId)
        );
      })
    );

    // array of appraisals
    this.$appraisals = this.store_appraisals
      .pipe(select(fromAppraisals.selectAllAppraisals))
      .subscribe(appraisals => {
        this.store_appraisals.dispatch(
          new fromAppraisals.GroupAppraisalsByJobs(appraisals)
        );
      });

    // array of appraisal groups
    this.appraisalGroups$ = this.store_appraisals.pipe(
      select(fromAppraisals.getAppraisalGroups)
      // tap(v => console.log(v))
    );

    // array of appraisal groups
    this.position$ = this.store_appraisals.pipe(
      select(fromAppraisals.getAppraisalPositionsCheck),
      tap(v => console.log(v))
    );

    this.$pagination = this.store_appraisals
      .pipe(select(fromAppraisals.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_appraisals
      .select(fromAppraisals.getAppraisalsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_appraisals
      .select(fromAppraisals.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_appraisals.dispatch(
      new fromAppraisals.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_appraisals.dispatch(
      new fromAppraisals.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_appraisals.dispatch(new fromAppraisals.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    console.log(data);
    const formRef = this.form.open(AppraisalsFormComponent, {
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

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$appraisals.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
