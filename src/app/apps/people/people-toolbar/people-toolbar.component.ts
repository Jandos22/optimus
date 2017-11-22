import { Store } from '@ngrx/store';
import * as fromRoot from '../../../store/app.reducers';
import * as fromPeople from '../store/people.reducer';
import * as people from '../store/people.actions';

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { PeopleSearch } from '../model/people-search.model';

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

  currentParams: Observable<PeopleSearch>;

  constructor(private store: Store<fromPeople.PeopleFeatureState>) {
  }

  ngOnInit() {

    // Initialize PeopleFilters Form
    this.peopleFiltersForm = new FormGroup({
      query: new FormControl(null),
    });

    // Update State on query text change > people.search.query
    this.peopleFiltersForm.controls['query'].valueChanges
      .debounceTime(700)
      .subscribe((query) => {
        this.processChangedParams('query', query);
        console.log(this.currentParams);
      });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
      .subscribe((location) => {
        if (location) {
          console.log(this.currentParams);
          this.processChangedParams('location', location);
        }
      });


    // this.searchParams$ = this.store.select(fromPeople.getPeopleSearchParams)
    // .subscribe((params) => {
    //   if (params) {
    //     if (params) {
    //       this.store.dispatch(new people.PeopleProcessNewSearchParams(params));
    //     }

    //    }
    // });

  }

  processChangedParams(field, value): PeopleSearch {
    console.log(field, value);
    switch (field) {
      case 'location':
        return {
          ...this.currentParams,
          location: value
        };

      case 'query':
      console.log('query updated');
      return {
        ...this.currentParams,
        query: value
      };

      default:
        return this.currentParams;
    }
  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.searchParams$.unsubscribe();
  }

}
