import { MatListItem } from '@angular/material';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'people-list-item',
  styleUrls: ['people-list-item.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center" class="itemContainer">

      <button mat-icon-button fxFLex="40px">
        <img [src]="user.Photo?.Url" [alt]="user.Photo?.Description" class="peopleAvatar">
      </button>

      <span fxFlex class="listItemMiddle">
        <span fxLayout="column">
          <span>{{ user.Name }} {{ user.Surname }}</span>
          <span class="emailLink"><a matLine [href]="'mailto:' + user.Email" class="emailLink">{{ user.Email }}</a></span>
        </span>
      </span>

      <span fxFlex="40px" class="right">
      </span>

    </div>
          
    <mat-divider *ngIf="!last"></mat-divider>
    `
})
export class PeopleListItemComponent {
  @Input() user: any;
  @Input() last: boolean;
  constructor() { }
}
