import { Component, Input, ViewEncapsulation } from '@angular/core';

// interfaces
import {
  SharepointUser,
  OptimusUser
} from '../../../shared/interface/user.model';

@Component({
  selector: 'app-sidenav-header',
  styleUrls: ['sidenav-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="sidenav__header--container" fxLayout="row" fxLayoutAlign="start center">

        <app-sidenav-header-no-account *ngIf="!userOptimus.isRegistered"
            fxFlex fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="8px"
            [userSharepoint]="userSharepoint">
        </app-sidenav-header-no-account>

    </div>
    `
})
export class SidenavHeaderComponent {
  @Input() userSharepoint: SharepointUser;
  @Input() userOptimus: OptimusUser;

  constructor() {}
}
