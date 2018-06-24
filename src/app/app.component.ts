import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from './store';
import * as a_in_locations from './store/actions/locations.actions';

// font-awesome
import fontawesome from '@fortawesome/fontawesome';
import { faSpinner, faBullhorn } from '@fortawesome/fontawesome-free-solid';
import { faUserCircle, faSave } from '@fortawesome/fontawesome-free-regular';

// font-awesome imports
fontawesome.library.add(faSpinner, faUserCircle, faSave, faBullhorn);

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
  constructor(private s_in_root: Store<fromRoot.RootState>) {}

  ngOnInit() {
    // get locations, then write in root > locations
    this.s_in_root.dispatch(new a_in_locations.GetLocations());
  }
}
