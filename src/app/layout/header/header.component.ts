import { HeaderProperties } from './../../shared/interfaces/header-properties.model';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as layout from '../../store/layout.actions';
import { Locations } from '../../shared/interfaces/locations.model';
import { SidenavProperties } from '../../shared/interfaces/sidenav-properties.model';
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

  sidenav$: Observable<SidenavProperties>;

  // isSidenavOpen$: Observable<boolean>;
  // sidenavOpen: boolean;
  // sidenavMode$: Observable<string>;
  // sidenavMode: string;

  // Header Properties
  header: HeaderProperties;

  // Current User Information
  isRegistered$: Observable<boolean>;
  initials$: Observable<string>;
  photo$: Observable<string>;

  constructor(private store: Store<fromRoot.State>) {

    this.header = {
      title: null,
      appNameClass: null
    };

    this.locations$ = this.store.select(fromRoot.getApplicationLocations);
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation);
    this.appName$ = this.store.select(fromRoot.getApplicationName);

    this.sidenav$ = this.store.select(fromRoot.getSidenavState);

    // this.isSidenavOpen$ = this.store.select(fromRoot.getSidenavOpened);
    // this.sidenavMode$ = this.store.select(fromRoot.getSidenavMode);

    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
    this.initials$ = this.store.select(fromRoot.getInitials);
    this.photo$ = this.store.select(fromRoot.getPhoto);

   }

  ngOnInit() {
    this.store.dispatch(new application.GetLocations());

    this.sidenav$.subscribe((sidenav) => {
      this.recalculateHeader(sidenav.opened, sidenav.mode);
    });

  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  onSelectLocation(location) {
    this.store.dispatch(new application.SetSelectedLocation(location));
  }

  recalculateHeader (opened, mode) {
    console.log(opened, mode);
    if (opened && mode === 'side') {

      this.header.title = true;
      this.header.appNameClass = 'both';

    } else if (!opened && mode === 'side') {

      this.header.title = false;
      this.header.appNameClass = 'single';

    } else if (mode === 'over') {

      this.header.title = false;
      this.header.appNameClass = 'single';

    } else {
      console.log('recalculate header: no match');
    }
    console.log(this.header);
  }

}
