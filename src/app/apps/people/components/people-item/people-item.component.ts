import { Component, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { PeopleItem } from '../../../../shared/interface/people.model';
import { PathSlbSp } from '../../../../shared/constants';

@Component({
  selector: 'app-people-item',
  styleUrls: ['people-item.component.scss'],
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" class="itemContainer">

        <button mat-icon-button fxFlex="40px" (click)="openUserForm.emit(user)">
            <img *ngIf="user.Attachments" [src]="userPhoto" [alt]="user.Alias" class="peopleAvatar">
            <span *ngIf="!user.Attachments" style="font-size: 36px;">
              <fa-icon [icon]="['far', 'user-circle']"></fa-icon>
            </span>
        </button>

        <span fxFlex class="listItemMiddle">
            <span fxLayout="column">
            <span>{{ user.Name }} {{ user.Surname }}</span>
            <span class="emailLink"><a matLine [href]="'mailto:' + user.Email" class="emailLink">{{ user.Email }}</a></span>
            </span>
        </span>

        <span fxFlex="40px" class="right"></span>

    </div>
    <mat-divider *ngIf="!last"></mat-divider>
    `
})
export class PeopleItemComponent {
  @Input() user: PeopleItem;
  @Input() last: boolean;

  @Output() openUserForm = new EventEmitter<any>();

  constructor() {}

  get userPhoto() {
    if (this.user.Attachments) {
      return (
        `${PathSlbSp}` + this.user.AttachmentFiles.results[0].ServerRelativeUrl
      );
    } else {
      return null;
    }
  }
}
