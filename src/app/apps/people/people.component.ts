import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromPeople from './store/people.reducer';
import * as fromRoot from '../../store/app.reducers';
import * as application from '../../store/application.actions';
import * as people from './store/people.actions';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleComponent implements OnInit, OnDestroy {

  appName = 'People';

  peopleFiltersForm: FormGroup;

  selectedLocation$: Subscription;
  searchParams$: Subscription;

  constructor(private store: Store<fromPeople.FeatureState>) {

  }

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
    // this.store.dispatch(new people.NavigatedToPeople());

    // Initialize People Filters Form
    this.peopleFiltersForm = new FormGroup({
      query: new FormControl(null),
    });

    this.peopleFiltersForm.controls['query'].valueChanges
      .debounceTime(700)
      .subscribe((query) => {
        this.store.dispatch(new people.UpdateSearchQuery(query));
      });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
      .subscribe((location) => {
        if (location) { this.store.dispatch(new people.UpdateSelectedLocationInSearch(location)); }
      });

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

    this.store.dispatch(new people.ClearState);
  }

}
