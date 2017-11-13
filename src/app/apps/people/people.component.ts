import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as people from './store/people.actions';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleComponent implements OnInit {

  appName = 'People';

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
    this.store.dispatch(new people.NavigatedToPeople());
  }

}
