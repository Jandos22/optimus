import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as layout from '../../../store/actions/layout.action';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  isRegistered$: Observable<boolean>;

  constructor(private store: Store<fromRoot.RootState>) {
    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
  }

  ngOnInit() {}

  ngOnDestroy() {}

  onSidenavClick() {
    this.store.dispatch(new layout.ClickSidenav());
  }
}
