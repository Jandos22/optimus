import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as layout from '../../../store/actions/layout.action';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {}

  onSidenavClick() {
    this.store.dispatch(new layout.ClickSidenav());
  }
}
