import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleListComponent implements OnInit {
  constructor(private store: Store<fromStore.PeopleState>) {}

  users$: Observable<PeopleItem>;

  ngOnInit() {
    this.users$ = this.store.select(fromStore.getPeopleList);
  }
}
