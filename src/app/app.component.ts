import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from './store/app.reducers';
import * as user from './store/user.actions';

@Component({
  selector: 'app-root',
  template: '<app-layout class="appMinWidth"></app-layout>',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.dispatch(new user.GetCurrentUser());
  }

}
