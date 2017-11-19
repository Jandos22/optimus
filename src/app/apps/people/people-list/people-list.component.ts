import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromPeople from '../store/people.reducer';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatList, MatListItem } from '@angular/material';


@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleListComponent implements OnInit {

  users$: Observable<any>;

  constructor(private store: Store<fromPeople.FeatureState>) { }

  ngOnInit() {
    this.users$ = this.store.select(fromPeople.getPeopleList);
  }

}
