import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromKaizen from '../../store';

// material
import { MatDialog } from '@angular/material';

// form component
import { KaizenFormComponent } from '../../forms';

// interfaces
import {
  KaizenSearchParams,
  KaizenProjectItem
} from '../../../../shared/interface/kaizen.model';
import { PaginationState } from '../../../people/store/reducers/pagination.reducer';
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-kaizen.common-app-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-kaizen-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)">
    </app-kaizen-header>

    <app-kaizen-projects-list
      fxFlex class="common-content"
      [projects]="data" (openForm)="openForm('view', $event)">
    </app-kaizen-projects-list>

    <app-kaizen-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-kaizen-footer>
  `,
  styleUrls: ['./kaizen.component.scss']
})
export class KaizenComponent implements OnInit, OnDestroy {
  appName = 'Kaizen';

  user$: Observable<PeopleItem>;

  $data: Subscription;
  data: KaizenProjectItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: KaizenSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_kaizen: Store<fromKaizen.KaizenState>,
    public form: MatDialog
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    // fetch Project Types list from database
    this.store_root.dispatch(new fromKaizen.FetchProjectTypes());
    // fetch Impact Types list from database
    this.store_root.dispatch(new fromKaizen.FetchImpactTypes());

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

    // main data = array of projects
    this.$data = this.store_kaizen
      .pipe(select(fromKaizen.selectAllProjects))
      .subscribe(data => {
        this.data = data;
      });

    this.$pagination = this.store_kaizen
      .pipe(select(fromKaizen.getPagination))
      .subscribe(pagination => (this.pagination = pagination));

    this.$searching = this.store_kaizen
      .select(fromKaizen.getProjectsSearching)
      .subscribe(search => {
        this.searching = search;
      });

    // monitor params for top
    this.$params = this.store_kaizen
      .select(fromKaizen.getParams)
      .subscribe(params => {
        this.params = params;
      });
  }

  onNext() {
    this.store_kaizen.dispatch(
      new fromKaizen.OnNext(
        this.pagination.links[this.pagination.currentIndex + 1]
      )
    );
  }

  onBack() {
    this.store_kaizen.dispatch(
      new fromKaizen.OnBack(
        this.pagination.links[this.pagination.currentIndex - 1]
      )
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_kaizen.dispatch(new fromKaizen.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(KaizenFormComponent, {
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
