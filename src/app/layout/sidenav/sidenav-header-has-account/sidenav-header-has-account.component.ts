import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// interfaces
import { PeopleItem } from '../../../shared/interface/people.model';

// services
import { UtilitiesService } from '../../../shared/services';

@Component({
  selector: 'app-sidenav-header-has-account',
  styleUrls: ['sidenav-header-has-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button>
      <span class="sidanav__user--photo" fxLayout="column" fxLayoutAlign="center center">
        <img *ngIf="user.Attachments" [src]="getPhotoUrl()">
      </span>
    </button>
    <div class="sivedav__user--info" fxLayout="column" fxLayoutAlign="end start">
        <span class="fullname">{{ user.Fullname}}</span>
        <div class="second_line" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="4px">
          <span>{{ user.LocationAssigned.Title }}</span>
          <span *ngIf="hasPosition()">&middot;</span>
          <span *ngIf="hasPosition()">{{ user.Position.Title}}</span>
        </div>
    </div>
    `
})
export class SidenavHeaderHasAccountComponent {
  @Input() user: PeopleItem;

  constructor(private utils: UtilitiesService) {}

  getPhotoUrl() {
    return this.utils.userPhoto(this.user);
  }

  hasPosition() {
    return this.user.PositionId ? true : false;
  }
}
