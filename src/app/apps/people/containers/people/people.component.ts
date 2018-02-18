import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromPeople from '../../store';
import * as fromSearchActions from '../../store/actions/search.action';
import * as fromUsersActions from '../../store/actions/users.action';
import * as fromApplicationActions from './../../../../store/actions/application.action';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  constructor(private store: Store<fromPeople.PeopleState>) {}

  ngOnInit() {
    this.store.dispatch(new fromApplicationActions.ChangeAppName(this.appName));
    this.store.dispatch(
      new fromSearchActions.TriggerSearch({
        query: '',
        location: 'KZTZ'
      })
    );
  }

  ngOnDestroy() {
    this.store.dispatch(new fromSearchActions.ClearSearchState());
    this.store.dispatch(new fromUsersActions.ClearUsersState());
  }
}
