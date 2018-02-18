import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

// ngrx
import * as fromPeople from '../../store/reducers/users.reducer';

// material
import { MatList, MatListItem } from '@angular/material';

// models
import { UserEntity } from '../../models/user-entity.model';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleListComponent implements OnInit {
  constructor(private store: Store<fromPeople.UsersState>) {}

  users$: Observable<UserEntity>;

  ngOnInit() {
    this.users$ = this.store.select(fromPeople.getUserEntities);
  }
}
