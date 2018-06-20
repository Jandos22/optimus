import { Component, Input } from '@angular/core';

// interfaces
import { UserState } from '../../../shared/interface/user.model';

// constants
import { WirelinePath } from './../../../shared/constants/index';

@Component({
  selector: 'app-header-user',
  styleUrls: ['header-user.component.scss'],
  template: `
    <span>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <img *ngIf="user.optimus.photo"
                [src]="user.optimus.photoUrl" [alt]="user.sharepoint.initials" class="userPhoto">
            <div *ngIf="!user.optimus.photo" class="userCredentials" fxLayout="row" fxLayoutAlign="center center">
                <span>{{ user.sharepoint.initials }}</span>
            </div>
        </button>
        <mat-menu #userMenu="matMenu">
        <button mat-menu-item>
            <!-- <mat-icon>dialpad</mat-icon> -->
            <span>{{ user.optimus.name }} {{ user.optimus.surname }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
            <!-- <mat-icon>dialpad</mat-icon> -->
            <span>Logout</span>
        </button>
        </mat-menu>
    </span>
    `
})
export class HeaderUserComponent {
  @Input() user: UserState;
  constructor() {}

  logout() {
    window.location.href = WirelinePath + '/_layouts/15/SignOut.aspx';
  }
}
