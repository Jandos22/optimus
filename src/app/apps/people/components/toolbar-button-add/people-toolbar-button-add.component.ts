import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-people-toolbar-button-add',
  styleUrls: ['people-toolbar-button-add.component.scss'],
  template: `
    <div class="common-button">
        <button mat-icon-button matTooltip="Post new event"
            (click)="openUserForm.emit()">
            <span class="fa_regular"><fa-icon [icon]="['fas', 'plus']"></fa-icon></span>
        </button>
    </div>
    `
})
export class PeopleToolbarButtonAddComponent {
  @Output() openUserForm = new EventEmitter<any>();
  constructor() {}
}
