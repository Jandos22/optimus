import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener
} from '@angular/core';

// rxjs
import { Observable, Subscription } from 'rxjs';
import * as fromRoot from './../store';
import * as a__layout from './../store/actions/layout.action';

// ngrx
import { Store } from '@ngrx/store';

// material
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
  MatDrawer,
  MatDrawerContainer
} from '@angular/material';

import { SidenavProperties } from './../models/sidenav-properties.m';
import { WindowProperties } from './../models/window-properties.m';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutComponent implements OnInit {
  // Observables
  sidenavOpened$: Observable<boolean>;
  sidenavMode$: Observable<string>;

  working$: Observable<boolean>;

  // Layout Properties

  windowState$: Subscription;
  windowState: WindowProperties;

  sidenavState$: Subscription;
  sidenavState: SidenavProperties;

  autocollapseWidth: number;

  // Sidenav Properties
  opened: boolean;
  mode: string;

  // Window Size
  innerWidth: number;
  innerHeight: number;

  constructor(private store: Store<fromRoot.RootState>) {
    this.sidenavOpened$ = this.store.select(fromRoot.getSidenavOpened);
    this.sidenavMode$ = this.store.select(fromRoot.getSidenavMode);

    this.working$ = this.store.select(fromRoot.getApplicationWorking);

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    this.windowState$ = this.store
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        if (window) {
          this.windowState = window;
        }
      });

    this.sidenavState$ = this.store
      .select(fromRoot.getSidenavState)
      .subscribe(sidenav => {
        if (sidenav) {
          this.sidenavState = sidenav;
        }
      });
  }

  ngOnInit() {
    this.updateLayout();
  }

  onSidenavClose() {
    if (this.sidenavState.opened === true) {
      this.store.dispatch(new a__layout.CloseSidenav());
    }
  }

  // listen to window size changes
  // update local vars for width and height
  // run updateLayout whenever window size changed
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
    this.updateLayout();
  }

  updateLayout() {
    const curretSidenavState: SidenavProperties = {
      opened: null,
      mode: '',
      lockedinclosed: this.sidenavState.lockedinclosed
    };

    const currentWindowState: WindowProperties = {
      isXXS: false,
      isXS: false,
      isS: false,
      isM: false,
      isL: false,
      isXL: false
    };

    const autocollapseWidth = 800;

    this.innerWidth <= autocollapseWidth
      ? (curretSidenavState.mode = 'over')
      : (curretSidenavState.mode = 'side');

    if (curretSidenavState.lockedinclosed === false) {
      this.innerWidth <= autocollapseWidth
        ? (curretSidenavState.opened = false)
        : (curretSidenavState.opened = true);
    }

    if (this.innerWidth <= 400) {
      currentWindowState.isXXS = true;
    } else if (this.innerWidth <= 600) {
      currentWindowState.isXS = true;
    } else if (this.innerWidth <= 960) {
      currentWindowState.isS = true;
    } else if (this.innerWidth <= 1280) {
      currentWindowState.isM = true;
    } else if (this.innerWidth <= 1920) {
      currentWindowState.isL = true;
    } else if (this.innerWidth > 1920) {
      currentWindowState.isXL = true;
    }

    if (
      curretSidenavState.mode !== this.sidenavState.mode ||
      curretSidenavState.opened !== this.sidenavState.opened ||
      currentWindowState.isXXS !== this.windowState.isXXS ||
      currentWindowState.isXS !== this.windowState.isXS ||
      currentWindowState.isS !== this.windowState.isS ||
      currentWindowState.isM !== this.windowState.isM ||
      currentWindowState.isL !== this.windowState.isL ||
      currentWindowState.isXL !== this.windowState.isXL
    ) {
      this.store.dispatch(
        // if local layout state differs from root state
        // then update root layout state
        new a__layout.UpdateLayout(currentWindowState, curretSidenavState)
      );
    }
  }
}
