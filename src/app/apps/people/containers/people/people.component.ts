import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as fromPeople from '../../store';
import * as fromRoot from '../../../../store';

import { PeopleSearchParams } from './../../models/people-search-params.model';
import { PeopleSearchUri } from './../../models/people-search-uri.model';

@Component({
  selector: 'app-people',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `

    <app-people-toolbar class="flexToolbar"></app-people-toolbar>
    <app-people-list class="flexContent"></app-people-list>
    <app-people-toolbar-bottom class="flexFooter" [uri]="uri"></app-people-toolbar-bottom>

  `
})
export class PeopleComponent implements OnInit, OnDestroy {
  // title in header
  appName = 'People';

  searchParams$: Subscription;
  searchUri$: Subscription;
  searchUriCurrent$: Subscription;

  uri: PeopleSearchUri;

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

    // monitor search params and respond to changes
    this.searchParams$ = this.peopleStore
      .select(fromPeople.getSearchParams)
      .subscribe(params => this.onParamsChange(params));

    // subscribe to search uri
    this.searchUri$ = this.peopleStore
      .select(fromPeople.getSearchUri)
      .subscribe(uri => {
        this.uri = uri;
        console.log(this.uri);
      });

    // monitor current uri and respond on updates
    this.searchUriCurrent$ = this.peopleStore
      .select(fromPeople.getSearchUriCurrent)
      .subscribe(__curr => {
        this.onCurrentUriChange(__curr);
      });
  }

  // when params change, then trigger action in effects
  // and update people.uri.current
  onParamsChange(params: PeopleSearchParams) {
    if (params.location !== null) {
      console.log('start');
      this.peopleStore.dispatch(new fromPeople.OnSearchParamsChange(params));
    }
  }

  onCurrentUriChange(__curr) {
    if (__curr) {
      this.peopleStore.dispatch(new fromPeople.StartSearchPeople(__curr));
    }
  }

  ngOnDestroy() {
    this.searchParams$.unsubscribe();
    this.searchUri$.unsubscribe();
    this.searchUriCurrent$.unsubscribe();
  }
}
