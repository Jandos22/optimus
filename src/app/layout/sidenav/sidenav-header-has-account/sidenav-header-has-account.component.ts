import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

// interfaces
import { PeopleItem } from './../../../shared/interface/people.model';

// services
import { UtilitiesService } from '../../../shared/services';

@Component({
  selector: 'app-sidenav-header-has-account',
  styleUrls: ['sidenav-header-has-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button>
      <img class="sidanav__user--photo" *ngIf="user.Attachments" [src]="getPhotoUrl()">
    </button>
    <div class="sivedav__user--info" fxLayout="column" fxLayoutAlign="end start">
        <span class="fullname">{{ user.Fullname}}</span>
        <span class="location">{{ user.LocationAssigned.Title }}</span>
    </div>
    `
})
export class SidenavHeaderHasAccountComponent {
  @Input() user: PeopleItem;

  constructor(private utils: UtilitiesService) {}

  getPhotoUrl() {
    return this.utils.photoUrl(this.user.AttachmentFiles);
  }
}
