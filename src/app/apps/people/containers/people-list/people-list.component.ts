import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

// ngrx
import * as fromStore from '../../store';

// material
import { MatList, MatListItem } from '@angular/material';

// models
import { PeopleItem } from '../../models/people-item.model';

@Component({
  selector: 'app-people-list',
  template: `
    <mat-nav-list>
      <people-list-item *ngFor="let user of list; last as last" [user]="user" [last]="last"></people-list-item>
    </mat-nav-list>
  `,
  styleUrls: ['./people-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleListComponent implements OnInit {
  @Input() list: PeopleItem[];

  constructor(private store: Store<fromStore.PeopleState>) {}

  users$: Observable<PeopleItem>;

  ngOnInit() {
    this.users$ = this.store.select(fromStore.getPeopleList);
  }
}
