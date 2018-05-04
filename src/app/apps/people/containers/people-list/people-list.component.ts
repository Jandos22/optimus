import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// models
import { PeopleItem } from '../../models/people-item.model';

@Component({
  selector: 'app-people-list',
  template: `
    <div fxLayout="column" fxLayoutAlign="start stretch"
      *ngFor="let user of list; last as last">

      <div fxLayout="row" fxLayoutAlign="space-between center" class="itemContainer">

        <button mat-icon-button fxFLex="40px" (click)="onOpenItem(user)">
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

    </div>
  `,
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  @Input() list: PeopleItem[];

  @Output() openItem = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onOpenItem(user) {
    this.openItem.emit(user);
  }
}
