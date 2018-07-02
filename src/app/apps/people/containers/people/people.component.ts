import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

// rxjs
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as fromPeople from '../../store';
import * as fromRoot from '../../../../store';

// material
import { MatDialog } from '@angular/material';

// interfaces
import {
  PeopleItem,
  UserSearchParams
} from './../../../../shared/interface/people.model';
import { PaginationIndexes } from './../../models/pagination-indexes.model';

// form component
import { PeopleFormComponent } from '../../forms/people-form/people-form.component';

import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-people.common-flex-container',
  styleUrls: ['./people.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-progress-bar *ngIf="searching"
      class="workingOnRequest" color="warn" mode="indeterminate">
    </mat-progress-bar>

    <app-people-header
      fxFlex="65px" class="common-header"
      [appName]="appName"
      (openForm)="openForm('new', $event)">
    </app-people-header>

    <app-people-content
      fxFlex class="common-content"
      [data]="data"
      (openUserForm)="openForm('view', $event)">
    </app-people-content>

    <app-people-toolbar-bottom class="flexFooter"
      [indexes]="indexes" [listLength]="dataLength"
      [from]="from" [to]="to" [total]="total"
      (onNext)="onNext($event)" (onBack)="onBack($event)">
    </app-people-toolbar-bottom>

    <simple-notifications [options]="options"></simple-notifications>
  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  // data
  data$: Subscription;
  data: PeopleItem[];

  total$: Subscription;
  total: any;

  searching$: Subscription;
  searching: boolean;

  // counter
  dataLength: number;
  from: number;
  to: number;

  // params
  params$: Subscription;
  params: UserSearchParams;

  // pagination
  indexes$: Subscription;
  links$: Subscription;

  // pagination local copy
  indexes: PaginationIndexes;
  links: string[];

  public options = {
    position: ['middle', 'center'],
    timeOut: 1500,
    animate: 'scale'
  };

  constructor(
    private store_people: Store<fromPeople.PeopleState>,
    private store_root: Store<fromRoot.RootState>,
    public form: MatDialog,
    private notify: NotificationsService
  ) {
    this.total$ = this.store_people
      .select(fromPeople.getUsersTotal)
      .subscribe(total => {
        this.total = total;
      });

    this.searching$ = this.store_people
      .select(fromPeople.getUsersSearching)
      .subscribe(search => {
        this.searching = search;
      });
  }

  ngOnInit() {
    // main data = array of users
    this.data$ = this.store_people
      .pipe(select(fromPeople.selectAllUsers))
      .subscribe(data => {
        // goes in people-list component
        this.data = data;

        // go in people-toolbar-bottom component
        this.dataLength = data.length;
        if (this.indexes) {
          this.from = this.indexes.current * this.params.top + 1;
          this.to = this.from + this.dataLength - 1;
        }

        // count total
        this.countTotalItems(this.params);
      });

    // update html page title
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

    // subscribe to indexes
    this.indexes$ = this.store_people
      .select(fromPeople.getPageIndexes)
      .subscribe(indexes => (this.indexes = indexes));

    // monitor current index, trigger search when changed
    this.params$ = this.store_people
      .select(fromPeople.getParams)
      .subscribe(params => {
        this.params = params;
      });

    // subscribe to search pagelinks
    this.links$ = this.store_people
      .select(fromPeople.getPageLinks)
      .subscribe(links => {
        this.links = links;
      });
  }

  onNext(indexes: PaginationIndexes) {
    this.store_people.dispatch(new fromPeople.OnNext(this.links[indexes.next]));
  }

  onBack(indexes: PaginationIndexes) {
    this.store_people.dispatch(
      new fromPeople.OnBack(this.links[indexes.previous])
    );
  }

  countTotalItems(params) {
    if (params) {
      this.store_people.dispatch(new fromPeople.BeginCount(params));
    }
  }

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(PeopleFormComponent, { data });
    formRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(res => {
        if (res.result === 'success') {
          this.notify.create('Successfully added', res.data.Alias, 'success');
        }
      });
  }

  ngOnDestroy() {
    this.data$.unsubscribe();
    this.total$.unsubscribe();
    this.indexes$.unsubscribe();
    this.params$.unsubscribe();
    this.links$.unsubscribe();
  }
}
