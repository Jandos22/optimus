import { Component, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { PeopleItem } from './../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-content',
  styleUrls: ['people-content.component.scss'],
  template: `
        <app-people-content-list
            class="common-content-container"
            fxFlex fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px"
            [data]="data"
            (openUserForm)="openUserForm.emit($event)">
        </app-people-content-list>
    `
})
export class PeopleContentComponent {
  @Input() data: PeopleItem[];
  @Output() openUserForm = new EventEmitter<any>();
  constructor() {}
}
