import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromPeople from './store/people.reducer';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as people from './store/people.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/skip';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleComponent implements OnInit, OnDestroy {

  appName = 'People';

  selectedLocation$: Subscription;
  searchParams$: Subscription;

  constructor(private store: Store<fromPeople.FeatureState>) {

  }

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
    // this.store.dispatch(new people.NavigatedToPeople());

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
      .subscribe((location) => {
        if (location) { this.store.dispatch(new people.UpdateSelectedLocationInSearch(location)); }
      });

    this.searchParams$ = this.store.select(fromPeople.getSearchParams)
      .subscribe((searchParams) => {
        if (searchParams.location) { console.log('search params updated'); }
      });

  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.searchParams$.unsubscribe();

    this.store.dispatch(new people.ClearState);
  }

}
