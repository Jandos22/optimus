import { Component, Input, ViewEncapsulation } from '@angular/core';

// interfaces
import { SharepointUser } from '../../../shared/interface/user.model';
import { PeopleItem } from './../../../shared/interface/people.model';

@Component({
  selector: 'app-sidenav-header',
  styleUrls: ['sidenav-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-sidenav-header-has-account *ngIf="userSharepoint.isRegistered"
      fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="8px"
      [user]="userOptimus">
    </app-sidenav-header-has-account>

    <app-sidenav-header-no-account *ngIf="!userSharepoint.isRegistered"
        fxFlex fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px"
        [userSharepoint]="userSharepoint">
    </app-sidenav-header-no-account>
    `
})
export class SidenavHeaderComponent {
  @Input() userSharepoint: SharepointUser;
  @Input() userOptimus: PeopleItem;

  constructor() {}
}
