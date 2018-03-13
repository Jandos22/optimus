import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as fromPeople from '../../store';
import * as fromRoot from '../../../../store';

import { PeopleParams } from './../../models/people-params.model';
import { PaginationIndexes } from './../../models/pagination-indexes.model';

@Component({
  selector: 'app-people',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `

    <app-people-toolbar class="flexToolbar"></app-people-toolbar>
    <app-people-list class="flexContent"></app-people-list>
    <app-people-toolbar-bottom class="flexFooter" [indexes]="indexes"
      (onNext)="onNext($event)" (onBack)="onBack($event)">
    </app-people-toolbar-bottom>

  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  // pagination
  indexes$: Subscription;
  indexCurrent$: Subscription;
  links$: Subscription;
  // pagination local copy
  indexes: PaginationIndexes;
  links: string[];

  constructor(
    private peopleStore: Store<fromPeople.PeopleState>,
    private rootStore: Store<fromRoot.RootState>
  ) {}

  ngOnInit() {
    // this fix is to make content of People to fill full height
    const app_people = document.getElementsByTagName('app-people')[0];
    app_people ? app_people.setAttribute('class', 'flexContainer') : '';

    // update html page title
    this.rootStore.dispatch(new fromRoot.ChangeAppName(this.appName));

    // subscribe to indexes
    this.indexes$ = this.peopleStore
      .select(fromPeople.getPageIndexes)
      .subscribe(indexes => {
        this.indexes = indexes;
        console.log(this.indexes);
      });

    // monitor current index, trigger search when changed
    this.indexCurrent$ = this.peopleStore
      .select(fromPeople.getPageCurrentIndex)
      .subscribe(index => {
        console.log(index);
      });

    // subscribe to search pagelinks
    this.links$ = this.peopleStore
      .select(fromPeople.getPageLinks)
      .subscribe(links => {
        this.links = links;
      });
  }

  // onCurrentIndexChange(index) {
  //   if (index) {
  //     this.peopleStore.dispatch(
  //       new fromPeople.StartSearchPeople(this.links[index])
  //     );
  //   }
  // }

  onNext(indexes: PaginationIndexes) {
    this.peopleStore.dispatch(new fromPeople.OnNext(this.links[indexes.next]));
  }

  onBack(indexes: PaginationIndexes) {
    this.peopleStore.dispatch(
      new fromPeople.OnBack(this.links[indexes.previous])
    );
  }

  ngOnDestroy() {
    this.indexes$.unsubscribe();
    this.indexCurrent$.unsubscribe();
    this.links$.unsubscribe();
  }
}
