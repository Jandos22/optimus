import { Store } from '@ngrx/store';
import * as fromPeople from '../store/people.reducer';
import * as people from '../store/people.actions';

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-people-toolbar',
  templateUrl: './people-toolbar.component.html',
  styleUrls: ['./people-toolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleToolbarComponent implements OnInit, OnDestroy {

  peopleFiltersForm: FormGroup;

  selectedLocation$: Subscription;
  searchParams$: Subscription;

  constructor(private store: Store<fromPeople.FeatureState>) { }

  ngOnInit() {

    // Initialize PeopleFilters Form
    this.peopleFiltersForm = new FormGroup({
      query: new FormControl(null),
    });

    // Update State on query text change > people.search.query
    this.peopleFiltersForm.controls['query'].valueChanges
    .debounceTime(700)
    .subscribe((querytext) => {
      this.store.dispatch(new people.UpdateSearchQuery(querytext));
    });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select('application')
    .subscribe((application) => {
      if (application) { this.store.dispatch(new people.UpdateSelectedLocationInSearch(application.location)); }
    });

    // Trigger Search when people.search changes in state
    this.searchParams$ = this.store.select(fromPeople.getSearchParams)
    .subscribe((searchParams) => {
      if (searchParams.location) {
        this.store.dispatch(new people.TriggerSearch(searchParams));
       }
    });

  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.searchParams$.unsubscribe();
  }

}
