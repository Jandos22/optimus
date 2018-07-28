import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

// rxjs
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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

@Component({
  selector: 'app-people.common-app-container',
  styleUrls: ['./people.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-people-header
      fxFlex="65px" class="common-header"
      [appName]="appName" [searching]="searching"
      (openUserForm)="openForm('new', $event)">
    </app-people-header>

    <app-people-content
      class="common-content"
      fxLayout="column"
      fxFlex [data]="data"
      (openUserForm)="openForm('view', $event)">
    </app-people-content>

    <app-people-footer fxFlex="49px" class="common-footer"
      [pagination]="pagination" [top]="params.top" [searching]="searching"
      (onNext)="onNext()" (onBack)="onBack()">
    </app-people-footer>

    <simple-notifications [options]="options"></simple-notifications>
  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // app title in header and store.root.apps.name
  appName = 'People';

  $data: Subscription;
  data: PeopleItem[];

  $searching: Subscription;
  searching: boolean;

  $params: Subscription;
  params: UserSearchParams;

  $pagination: Subscription;
  pagination: PaginationState;

  public options = {
    position: ['middle', 'center'],
    timeOut: 1500,
    animate: 'scale'
  };

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_people: Store<fromPeople.PeopleState>,
    public form: MatDialog,
    private notify: NotificationsService
  ) {}

  ngOnInit() {
    // update html page title and store.root.apps.name
    this.store_root.dispatch(new fromRoot.SetAppName(this.appName));

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

  openForm(mode, item?): void {
    const data = { mode, item };
    const formRef = this.form.open(PeopleFormComponent, { data });
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

  ngOnDestroy() {
    this.$pagination.unsubscribe();
    this.$data.unsubscribe();
    this.$params.unsubscribe();
    this.$searching.unsubscribe();
  }
}
