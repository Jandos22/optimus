import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

// rxjs
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from './../../store';
import * as fromRootUser from './../../store/reducers/user.reducer';
import * as fromAppsActions from './../../store/actions/apps.actions';
import * as layout from './../../store/actions/layout.actions';

// models
import { UserState } from './../../shared/interface/user.model';
import { SidenavProperties } from './../../models/sidenav-properties.m';
import { WindowProperties } from '../../shared/interface/layout.model';
import { HeaderProperties } from './../../models/header-properties.m';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName$: Observable<string>;

  window$: Observable<WindowProperties>;
  forWindowState$$: Subscription;

  sidenav$: Observable<SidenavProperties>;

  // Header Properties
  header: HeaderProperties;
  window: WindowProperties;

  // Current User Information
  $isRegistered: Observable<boolean>;
  // initials$: Observable<string>;
  // photo$: Subscription;

  // ngrx user slice
  $user: Observable<UserState>;

  // photo: string;

  constructor(
    private store: Store<fromRoot.RootState>,
    private router: Router
  ) {
    this.header = {
      title: null,
      appNameClass: null
    };

    this.appName$ = this.store.select(fromRoot.getAppName);

    this.window$ = this.store.select(fromRoot.getLayoutWindow);
    this.sidenav$ = this.store.select(fromRoot.getSidenavState);

    this.$isRegistered = this.store.select(fromRoot.getIsRegistered);
    // this.initials$ = this.store.select(fromRoot.getInitials);
  }

  ngOnInit() {
    // this.store.dispatch(new application.GetLocations());

    this.sidenav$.subscribe(sidenav => {
      this.recalculateHeader(sidenav.opened, sidenav.mode);
    });

    this.forWindowState$$ = this.window$.subscribe(window => {
      this.window = window;
    });

    this.$user = this.store.select(fromRoot.getUserState);
  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  recalculateHeader(opened, mode) {
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
  }

  ngOnDestroy() {}
}
