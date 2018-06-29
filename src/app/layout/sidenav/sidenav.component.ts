import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from './../../store';
import * as layout from './../../store/actions/layout.actions';

@Component({
  selector: 'app-sidenav',
  encapsulation: ViewEncapsulation.None,
  template: `
  <div fxFlexFill fxLayout="column" class="sidenav__container">

    <!-- User Information Section -->
    <app-sidenav-header fxFlex="65px" class="common-header"
      [userSharepoint]="userSharepoint$ | async"
      [userOptimus]="userOptimus$ | async">
    </app-sidenav-header>

    <ul fxLayout="column" fxFlex *ngIf="isRegistered$ | async">
      <li>
          <a routerLink="/" class="noSelect" (click)="onSidenavClick()">Timeline</a>
      </li>
      <li>
          <a routerLink="/people" class="noSelect" (click)="onSidenavClick()">People</a>
      </li>
      <li>
          <a routerLink="/ppe" class="noSelect" (click)="onSidenavClick()">PPE Point System</a>
      </li>
      <li>
          <a routerLink="/exemptions" class="noSelect" (click)="onSidenavClick()">Exemptions</a>
      </li>
      <li>
          <a routerLink="/registration" class="noSelect" (click)="onSidenavClick()">Registration</a>
      </li>
    </ul>

    <div *ngIf="!(isRegistered$ | async)" fxFlex></div>

    <app-sidenav-footer fxFlex="49px" class="common-footer"
      fxLayout="row" fxLayoutAlign="start center">
    </app-sidenav-footer>
  </div>
  `,
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  userSharepoint$: Observable<any>;
  userOptimus$: Observable<any>;

  isRegistered$: Observable<boolean>;

  constructor(private store: Store<fromRoot.RootState>) {
    this.isRegistered$ = this.store.select(fromRoot.getIsRegistered);
  }

  ngOnInit() {
    this.userSharepoint$ = this.store.pipe(select(fromRoot.getUserSharepoint));
    this.userOptimus$ = this.store.pipe(select(fromRoot.getUserOptimus));
  }

  ngOnDestroy() {}

  onSidenavClick() {
    this.store.dispatch(new layout.ClickSidenav());
  }
}
