import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromAppsActions from '../../../../store/actions/apps.actions';
import * as fromLayoutActions from '../../../../store/actions/layout.actions';

// interfaces
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { SharepointUser } from '../../../../shared/interface/user.model';

@Component({
  selector: 'app-registration.common-flex-container',
  styleUrls: ['registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-registration-header fxFlex="65px" class="common-header"
      (toggleSidenav)="toggleSidenav()">
    </app-registration-header>

    <app-registration-content fxFlex class="common-content"
      [userSharepoint]="userSharepoint$ | async"
      [locations]="locations$ | async">
    </app-registration-content>

    <app-registration-footer fxFlex="49px" class="common-footer">
    </app-registration-footer>
    `
})
export class RegistrationComponent implements OnInit {
  appName = 'Registration';

  userSharepoint$: Observable<SharepointUser>;
  locations$: Observable<LocationEnt[]>;

  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    this.store.dispatch(new fromAppsActions.SetAppName(this.appName));

    this.userSharepoint$ = this.store.pipe(select(fromRoot.getUserSharepoint));

    this.locations$ = this.store.pipe(select(fromRoot.selectAllLocations));
  }

  toggleSidenav() {
    this.store.dispatch(new fromLayoutActions.ToggleSidenav());
  }
}
