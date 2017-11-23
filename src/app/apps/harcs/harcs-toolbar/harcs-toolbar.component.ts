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

  constructor(private store: Store<fromHarcs.FeatureState>) { }

  ngOnInit() {

    // Initialize PeopleFilters Form
    this.harcsFiltersForm = new FormGroup({
      query: new FormControl(null),
      location: new FormControl(null)
    });

    // Update State on query text change > harcs.search.query
    this.harcsFiltersForm.controls['query'].valueChanges
      .debounceTime(700)
      .subscribe(() => { this.onHarcsFormChange(); });

    this.harcsFiltersForm.controls['location'].valueChanges
      .debounceTime(700)
      .subscribe(() => { this.onHarcsFormChange(); });

    // This subscription will update SEARCH parameters whenever user changes LOCATION in header
    this.selectedLocation$ = this.store.select(fromRoot.getApplicationLocation)
      .subscribe((location) => {

        if (location !== this.harcsFiltersForm.controls['location'].value) {
          this.harcsFiltersForm.controls['location'].setValue(location);
        }

      });

  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
  }

  onHarcsFormChange() {
    const params = this.harcsFiltersForm.value;
    this.store.dispatch(new harcs.UpdateSearchParams(params));
    this.store.dispatch(new harcs.TriggerSearch(params));
  }

}
