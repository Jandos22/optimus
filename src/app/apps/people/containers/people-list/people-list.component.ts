import { Component, OnInit, Input } from '@angular/core';

// models
import { PeopleItem } from '../../models/people-item.model';

@Component({
  selector: 'app-people-list',
  template: `
    <people-list-item 
      fxLayout="column" fxLayoutAlign="start stretch"
      *ngFor="let user of list; last as last" 
      [user]="user" [last]="last"
      >
    </people-list-item>
  `,
  styleUrls: ['./people-list.component.css'],
})
export class PeopleListComponent implements OnInit {
  @Input() list: PeopleItem[];

  constructor() { }

  ngOnInit() { }
}
