import { Component, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { PeopleItem } from '../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-content-list',
  styleUrls: ['people-content-list.component.scss'],
  template: `
        <app-people-content-list-item
          *ngFor="let item of data; last as last"
          class="common-content-item people-list-item"
          [ngClass]="{ last: last }"
          [item]="item"
          (openUserForm)="openUserForm.emit($event)">
        </app-people-content-list-item>
    `
})
export class PeopleContentListComponent {
  @Input() data: PeopleItem[];
  @Output() openUserForm = new EventEmitter<any>();
  constructor() {}
}
