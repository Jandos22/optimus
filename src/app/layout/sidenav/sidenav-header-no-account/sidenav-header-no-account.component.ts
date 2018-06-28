import { Component, Input, ViewEncapsulation } from '@angular/core';

// interfaces
import { SharepointUser } from '../../../shared/interface/user.model';

@Component({
  selector: 'app-sidenav-header-no-account',
  styleUrls: ['sidenav-header-no-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
        <!-- Optimus account NOT found -->
        <div *ngIf="userSharepoint.initials"
            class="sidenav__user--credentials" fxLayout="column" fxLayoutAlign="center center">
            <span>{{ userSharepoint.initials}}</span>
        </div>
        <div fxLayout="column" fxLayoutAlig="center start" class="sidenav__user--account">
            <div class="username">{{ userSharepoint.username}}</div>
            <div class="info" *ngIf="userSharepoint.username" matTooltip="fill in registration form -->">
                not registered
            </div>
        </div>
    `
})
export class SidenavHeaderNoAccountComponent {
  @Input() userSharepoint: SharepointUser;
  constructor() {}
}
