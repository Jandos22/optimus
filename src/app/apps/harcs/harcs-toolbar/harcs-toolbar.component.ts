import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/app.reducers';
import * as fromHarcs from '../store/harcs.reducer';
import * as harcs from '../store/harcs.actions';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-harcs-toolbar',
  templateUrl: './harcs-toolbar.component.html',
  styleUrls: ['./harcs-toolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HarcsToolbarComponent implements OnInit, OnDestroy {

  harcsFiltersForm: FormGroup;

  selectedLocation$: Subscription;
  searchParamsLocation$: Subscription;
  searchParamsQuery$: Subscription;

  constructor(private store: Store<fromHarcs.HarcsFeatureState>) { }

  ngOnInit() {

    // Initialize PeopleFilters Form
    this.harcsFiltersForm = new FormGroup({
      query: new FormControl(null),
    });

    // Update State on query text change > harcs.search.query
    this.harcsFiltersForm.controls['query'].valueChanges
    .debounceTime(700)
    .subscribe((querytext) => {
      this.store.dispatch(new harcs.HarcsUpdateSearchQuery(querytext));
    });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
    .subscribe((location) => {
      console.log(location);
      if (location) { this.store.dispatch(new harcs.HarcsUpdateSelectedLocationInSearch(location)); }
    });

    // Trigger Search when people.search changes in state
    this.searchParamsLocation$ = this.store.select(fromHarcs.getHarcsSearchLocation)
    .subscribe((location) => {
      console.log(location);
      if (location) {
        this.store.dispatch(new harcs.HarcsTriggerSearch(location));
       }
    });

    // Trigger Search when people.search changes in state
    this.searchParamsQuery$ = this.store.select(fromHarcs.getHarcsSearchQuery)
    .subscribe((query) => {
      console.log(query);
      if (query) {
        this.store.dispatch(new harcs.HarcsTriggerSearch(query));
       }
    });

  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.searchParamsLocation$.unsubscribe();
    this.searchParamsQuery$.unsubscribe();
  }

}
