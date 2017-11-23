import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPeople from './store/people.reducer';
import * as application from '../../store/application.actions';
import * as people from './store/people.actions';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleComponent implements OnInit, OnDestroy {

  appName = 'People';

  constructor(private store: Store<fromPeople.FeatureState>) {

  }

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
  }

  ngOnDestroy() {
    this.store.dispatch(new people.ClearState);
  }

}
