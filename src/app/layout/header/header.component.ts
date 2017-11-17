import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as layout from '../../store/layout.actions';
import { Locations } from '../../shared/interfaces/locations.model';
// import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit {

  appName$: Observable<string>;
  locations$: Observable<Locations>;
  selectedLocation$: Observable<string>;

  isSmall$: Observable<boolean>;

  // Current User Information
  isRegistered$: Observable<boolean>;
  initials$: Observable<string>;
  photo$: Observable<string>;

  constructor(private store: Store<fromRoot.State>) {

    this.locations$ = this.store.select(fromRoot.getApplicationLocations);
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation);
    this.appName$ = this.store.select(fromRoot.getApplicationName);

    this.isSmall$ = this.store.select(fromRoot.getIsSmall);

    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
    this.initials$ = this.store.select(fromRoot.getInitials);
    this.photo$ = this.store.select(fromRoot.getPhoto);
   }

  ngOnInit() {
    this.store.dispatch(new application.GetLocations());
  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  onSelectLocation(location) {
    this.store.dispatch(new application.SetSelectedLocation(location));
  }

}
