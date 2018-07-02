import { take } from 'rxjs/operators';
import { LocationEnt } from './../../shared/interface/locations.model';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Observable, Subscription } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from './../../store';
import * as layout from './../../store/actions/layout.actions';

// interfaces
import { AppItem } from '../../shared/interface/applications.model';
import { PeopleItem } from '../../shared/interface/people.model';

@Component({
  selector: 'app-sidenav',
  encapsulation: ViewEncapsulation.None,
  template: `
  <div fxFlexFill fxLayout="column" class="sidenav__container">

    <!-- User Information Section -->
    <app-sidenav-header *ngIf="userSharepoint$ | async"
      fxFlex="65px"  fxLayout="row" fxLayoutAlign="start center"
      class="common-header"
      [userSharepoint]="userSharepoint$ | async"
      [userOptimus]="userOptimus">
    </app-sidenav-header>

    <app-sidenav-content *ngIf="myLocation$ | async"
      fxFlex class="common-content"
      [myLocation]="myLocation$ | async"
      [apps]="applications$ | async"
      [showHiddenApps]="showHiddenApps">
    </app-sidenav-content>

    <app-sidenav-footer *ngIf="userOptimus"
      fxFlex="49px" class="common-footer"
      fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="0px"
      [showHiddenApps]="showHiddenApps"
      (onToggleHiddenApps)="onToggleHiddenApps()">
    </app-sidenav-footer>
  </div>
  `,
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  $userOptimus: Subscription;
  userOptimus: PeopleItem;

  userSharepoint$: Observable<any>;

  applications$: Observable<AppItem[]>;

  isRegistered$: Observable<boolean>;

  // $myLocation: Subscription;
  myLocation$: Observable<LocationEnt>;

  showHiddenApps = false;

  constructor(private store: Store<fromRoot.RootState>) {
    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
  }

  ngOnInit() {
    this.userSharepoint$ = this.store.pipe(select(fromRoot.getUserSharepoint));
    this.applications$ = this.store.pipe(select(fromRoot.selectAllApps));

    this.$userOptimus = this.store
      .pipe(select(fromRoot.getUserOptimus))
      .subscribe((user: PeopleItem) => {
        if (user) {
          this.userOptimus = user;
          this.getMyLocation(user.LocationAssignedId);
        }
      });
  }

  // location of assignment
  getMyLocation(id: number) {
    console.log('location by id requested:' + id);
    this.myLocation$ = this.store.pipe(select(fromRoot.getLocationById(id)));
  }

  onToggleHiddenApps() {
    console.log(this.showHiddenApps);
    return this.showHiddenApps
      ? (this.showHiddenApps = false)
      : (this.showHiddenApps = true);
  }

  ngOnDestroy() {}

  onSidenavClick() {
    this.store.dispatch(new layout.ClickSidenav());
  }
}
