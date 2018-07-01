import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from './store';
import * as fromLocationsActions from './store/actions/locations.actions';
import * as fromAppsActions from './store/actions/apps.actions';

// this fix is only required in iOS Safari
import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill';
viewportUnitsBuggyfill.init({
  refreshDebounceWait: 50,
  hacks: viewportUnitsBuggyfill.hacks
});

@Component({
  selector: 'app-root',
  template: `
    <app-layout></app-layout>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    // get locations, then write in root > locations
    this.store.dispatch(new fromLocationsActions.GetLocations());
    this.store.dispatch(new fromAppsActions.GetAllApps());
  }
}
