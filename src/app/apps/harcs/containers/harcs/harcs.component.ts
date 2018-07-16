import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

@Component({
  selector: 'app-harcs.common-app-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-harcs-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      [accessLevel]="(user$ | async).Position?.AccessLevel"
      (openForm)="openForm('new', $event)">
    </app-harcs-header>

    <app-harcs-list
      fxFlex class="common-content"
      [harcs]="data" (openForm)="openForm('view', $event)">
    </app-harcs-list>

    <app-harcs-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-harcs-footer>
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

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_harcs: Store<fromHarcs.HarcsState>,
    public form: MatDialog
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    this.user$ = this.store_root.pipe(select(fromRoot.getUserOptimus));

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

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
