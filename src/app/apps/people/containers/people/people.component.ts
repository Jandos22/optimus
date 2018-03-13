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
    <app-people-toolbar-bottom class="flexFooter" [indexes]="uri"
      (onNext)="onNext()" (onPrev)="onPrev(uri)">
    </app-people-toolbar-bottom>

  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  params$: Subscription;
  indexes$: Subscription;
  indexCurrent$: Subscription;
  links$: Subscription;

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

    // monitor params and respond to changes
    this.params$ = this.peopleStore
      .select(fromPeople.getParams)
      .subscribe(params => this.onParamsChange(params));

    // subscribe to indexes
    this.indexes$ = this.peopleStore
      .select(fromPeople.getPageIndexes)
      .subscribe(indexes => {
        this.indexes = indexes;
        console.log(this.indexes);
      });

    // subscribe to search pagelinks
    this.links$ = this.peopleStore
      .select(fromPeople.getPageLinks)
      .subscribe(links => {
        this.links = links;
      });

    // monitor current uri and respond on updates
    this.indexCurrent$ = this.peopleStore
      .select(fromPeople.getPageCurrentIndex)
      .subscribe(curr => {
        this.onCurrentIndexChange(curr);
      });
  }

  // when params change, then trigger action in effects
  // and update people.uri.current
  onParamsChange(params: PeopleParams) {
    if (params.location !== null) {
      console.log('params changed');
      this.peopleStore.dispatch(new fromPeople.OnParamsChange(params));
    }
  }

  onCurrentIndexChange(index) {
    if (index) {
      this.peopleStore.dispatch(
        new fromPeople.StartSearchPeople(this.links[index])
      );
    }
  }

  // when next clicked, then pass __next to __curr
  // and pass __curr to __prev
  onNext() {}

  onPrev() {}

  ngOnDestroy() {
    this.params$.unsubscribe();
    this.indexes$.unsubscribe();
    this.indexCurrent$.unsubscribe();
    this.links$.unsubscribe();
  }
}
