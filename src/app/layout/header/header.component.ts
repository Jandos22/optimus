import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

// rxjs
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from './../../store';
import * as fromRootUser from './../../store/reducers/user.reducer';
import * as a_in_app from './../../store/actions/app.actions';
import * as layout from './../../store/actions/layout.actions';

// constants
import { WirelinePath } from './../../shared/constants/index';

// models
import { UserState } from './../../ngrx-state-models/user-state.model';
import { Locations } from './../../models/locations.m';
import { SidenavProperties } from './../../models/sidenav-properties.m';
import { WindowProperties } from './../../models/window-properties.m';
import { HeaderProperties } from './../../models/header-properties.m';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName$: Observable<string>;
  locations$: Observable<Locations[]>;
  selectedLocation$: Observable<string>;

  window$: Observable<WindowProperties>;
  forWindowState$$: Subscription;

  sidenav$: Observable<SidenavProperties>;

  // Header Properties
  header: HeaderProperties;
  window: WindowProperties;

  // Current User Information
  isRegistered$: Observable<boolean>;
  initials$: Observable<string>;
  // photo$: Subscription;

  // ngrx user slice
  user$: Subscription;
  user: UserState;

  // photo: string;

  constructor(
    private store: Store<fromRoot.RootState>,
    private router: Router
  ) {
    this.header = {
      title: null,
      appNameClass: null
    };

    this.locations$ = this.store.select(fromRoot.getAppLocations);
    this.selectedLocation$ = this.store.select(fromRoot.getAppLocation);
    this.appName$ = this.store.select(fromRoot.getAppName);

    this.window$ = this.store.select(fromRoot.getLayoutWindow);
    this.sidenav$ = this.store.select(fromRoot.getSidenavState);

    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
    this.initials$ = this.store.select(fromRoot.getInitials);
  }

  ngOnInit() {
    // this.store.dispatch(new application.GetLocations());

    this.sidenav$.subscribe(sidenav => {
      this.recalculateHeader(sidenav.opened, sidenav.mode);
    });

    this.forWindowState$$ = this.window$.subscribe(window => {
      this.window = window;
    });

    this.user$ = this.store
      .select(fromRoot.getUserState)
      .pipe(
        map((user: UserState) => {
          const photo = `${user.photo}?v=${new Date().getTime()}`;
          return { ...user, photo };
        })
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  onSelectLocation(location) {
    this.store.dispatch(new a_in_app.SetSelectedLocation(location));
  }

  recalculateHeader(opened, mode) {
    // console.log(opened, mode);
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
    // console.log(this.header);
  }

  logout() {
    window.location.href = WirelinePath + '/_layouts/15/SignOut.aspx';
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
