import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from './store';
import * as user from './store/actions/user.action';

@Component({
  selector: 'app-root',
  template: '<app-layout></app-layout>',
  styles: []
})
export class AppComponent implements OnInit {
  constructor(public store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    this.store.dispatch(new user.GetCurrentUser());
  }
}
