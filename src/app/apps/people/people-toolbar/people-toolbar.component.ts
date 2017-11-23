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

  constructor(private store: Store<fromPeople.FeatureState>) {
  }

  ngOnInit() {

    // Initialize PeopleFilters Form
    this.peopleFiltersForm = new FormGroup({
      query: new FormControl(null),
      location: new FormControl(null)
    });

    // Update State on query text change > people.search.query
    this.peopleFiltersForm.controls['query'].valueChanges
      .debounceTime(700)
      .subscribe(() => { this.onPeopleFormChange(); });

    this.peopleFiltersForm.controls['location'].valueChanges
      .debounceTime(700)
      .subscribe(() => { this.onPeopleFormChange(); });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
      .subscribe((location) => {

        if (location !== this.peopleFiltersForm.controls['location'].value) {
          this.peopleFiltersForm.controls['location'].setValue(location);
        }

      });

  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
  }

  onPeopleFormChange() {
    const params = this.peopleFiltersForm.value;
    this.store.dispatch(new people.UpdateSearchParams(params));
    this.store.dispatch(new people.TriggerSearch(params));
  }

}
