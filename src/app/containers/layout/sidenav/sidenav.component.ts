import { Component, OnInit, OnDestroy } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store';
import * as layout from '../../../store/actions/layout.action';

@Component({
  selector: 'app-sidenav',
  template: `
  <ul fxLayout="column" fxFlexFill >
    <li *ngIf="isRegistered$ | async">
        <a routerLink="/" class="noSelect" (click)="onSidenavClick()">Home</a>
    </li>
    <li *ngIf="isRegistered$ | async">
        <a routerLink="/people" class="noSelect" (click)="onSidenavClick()">People</a>
    </li>
    <li *ngIf="isRegistered$ | async">
        <a routerLink="/ppe" class="noSelect" (click)="onSidenavClick()">PPE Point System</a>
    </li>
    <li *ngIf="isRegistered$ | async">
        <a routerLink="/exemptions" class="noSelect" (click)="onSidenavClick()">Exemptions</a>
    </li>
    <li *ngIf="(isRegistered$ | async) === false">
        <a routerLink="/registration" class="noSelect" (click)="onSidenavClick()">Registration</a>
    </li>
  </ul>
  `,
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
