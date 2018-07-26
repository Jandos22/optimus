import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromJobs from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { JobsFormComponent } from '../../forms';

// interfaces
import {
  JobsSearchParams,
  JobItem
} from '../../../../shared/interface/jobs.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-jobs.common-app-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-jobs-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)">
    </app-jobs-header>

    <app-jobs-list
      fxFlex class="common-content"
      [jobs]="data" (openForm)="openForm('view', $event)">
    </app-jobs-list>

    <app-jobs-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-jobs-footer>
  `,
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  appName = 'Jobs';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: JobItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: JobsSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_jobs: Store<fromJobs.JobsState>,
    public form: MatDialog
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // main data = array of jobs
    this.$data = this.store_jobs
      .pipe(select(fromJobs.selectAllJobs))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_jobs
      .pipe(select(fromJobs.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_jobs
      .select(fromJobs.getJobsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_jobs
      .select(fromJobs.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_jobs.dispatch(
      new fromJobs.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_jobs.dispatch(
      new fromJobs.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_jobs.dispatch(new fromJobs.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    console.log(data);
    const formRef = this.form.open(JobsFormComponent, {
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

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
