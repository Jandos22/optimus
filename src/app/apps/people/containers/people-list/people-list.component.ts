import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { PeopleItem } from './../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-list',
  template: `
    <app-people-item fxLayout="column" fxLayoutAlign="start stretch"
      *ngFor="let user of list; last as last"
      [user]="user" [last]="last" (openItem)="onOpenItem(user)">
    </app-people-item>
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
