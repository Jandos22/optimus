import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRoot from '../store/app.reducers';
import * as layout from '../store/layout.actions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutComponent implements OnInit {

  // Observables
  sidenavShow$: Observable<boolean>;
  sidenavMode$: Observable<string>;
  sidenavAutoCollapseWidth$: Observable<number>;
  sidenavBackDrop$: Observable<boolean>;
  sidenavCloseOnBackDrop$: Observable<boolean>;

  // Window Size
  innerWidth: number;
  innerHeight: number;

  constructor(private store: Store<fromRoot.State>) {

    this.sidenavShow$ = this.store.select(fromRoot.getSidenavState);
    this.sidenavMode$ = this.store.select(fromRoot.getSidenavMode);
    this.sidenavAutoCollapseWidth$ = this.store.select(fromRoot.getSidenavAutoCollapseWidth);
    this.sidenavBackDrop$ = this.store.select(fromRoot.getSidenavBackDrop);
    this.sidenavCloseOnBackDrop$ = this.store.select(fromRoot.getSidenavCloseOnBackDrop);

    this.innerWidth = (window.innerWidth);
    this.innerHeight = (window.innerHeight);

   }

  ngOnInit() {

    this.initLayout();

  }

  initLayout() {
    const payload = { innerWidth: this.innerWidth,
                      innerHeight: this.innerHeight };
    this.store.dispatch(new layout.InitLayout(payload));
  }

  toggleSidenav() { this.store.dispatch(new layout.ToggleSidenav()); }

  closeSidenav() { this.store.dispatch(new layout.CloseSidenav()); }

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.innerHeight = event.target.innerHeight;
    this.initLayout();
  }

}
