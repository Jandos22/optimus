import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromApplicationActions from './../../../../store/actions/application.action';
import * as fromLayoutActions from '../../../../store/actions/layout.action';

import { Locations } from './../../../../models/locations.m';

@Component({
  selector: 'app-registration',
  styleUrls: ['registration.component.css'],
  template: `
    <app-new-user-form fxLayout="row" fxLayoutAlign="center"
        [alias]="alias"
        [email]="email"
        [locations]="locations">
    </app-new-user-form>
    `
})
export class RegistrationComponent implements OnInit, OnDestroy {
  appName = 'Registration';
  alias: string;
  email: string;
  locations: Locations[];

  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    this.store.dispatch(new fromApplicationActions.ChangeAppName(this.appName));

    // don't even show sidenav when self-registration is opened [pending]
    // this.store.dispatch(new fromLayoutActions.CloseSidenav());

    this.store.select(fromRoot.getUsername).subscribe(value => {
      this.alias = value;
    });

    this.store.select(fromRoot.getEmail).subscribe(value => {
      this.email = value;
    });

    this.store.select(fromRoot.getApplicationLocations).subscribe(array => {
      console.log(array);
      this.locations = array;
    });
  }

  ngOnDestroy() {}
}
