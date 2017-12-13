import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store';
import * as application from '../../../store/actions/application.action';
import * as layout from '../../../store/actions/layout.action';

import { Locations } from '../../../models/locations.m';
import { SidenavProperties } from '../../../models/sidenav-properties.m';
import { WindowProperties } from '../../../models/window-properties.m';
import { HeaderProperties } from '../../../models/header-properties.m';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HeaderComponent implements OnInit {
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
  photo$: Observable<string>;

  constructor(private store: Store<fromRoot.RootState>) {
    this.header = {
      title: null,
      appNameClass: null
    };

    this.locations$ = this.store.select(fromRoot.getApplicationLocations);
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation);
    this.appName$ = this.store.select(fromRoot.getApplicationName);

    this.window$ = this.store.select(fromRoot.getWindowState);
    this.sidenav$ = this.store.select(fromRoot.getSidenavState);

    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
    this.initials$ = this.store.select(fromRoot.getInitials);
    this.photo$ = this.store.select(fromRoot.getPhoto);
  }

  ngOnInit() {
    this.store.dispatch(new application.GetLocations());

    this.sidenav$.subscribe(sidenav => {
      this.recalculateHeader(sidenav.opened, sidenav.mode);
    });

    this.forWindowState$$ = this.window$.subscribe(window => {
      this.window = window;
      // console.log(this.window.isXS);
    });
  }

  toggleSidenav() {
    this.store.dispatch(new layout.ToggleSidenav());
  }

  onSelectLocation(location) {
    this.store.dispatch(new application.SetSelectedLocation(location));
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
}