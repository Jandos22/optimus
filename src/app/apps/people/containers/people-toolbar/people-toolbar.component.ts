import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as fromPeople from '../../store';

import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';

import { debounceTime, map, tap, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-people-toolbar',
  styleUrls: ['people-toolbar.component.css'],
  template: `
    <mat-toolbar class="toolbar">
        <mat-toolbar-row class="customToolbarRowTop">

          <div fxFlexFill fxLayout="row" fxLayoutAlign="start center">

            <span>
                <button mat-icon-button>
                    <mat-icon>add</mat-icon>
                </button>
            </span>

            <app-people-search
                [parent]="peopleFiltersForm">
            </app-people-search>

            <span fxFlex></span>

            <button mat-icon-button>
              <mat-icon>filter_list</mat-icon>
            </button>

          </div>

        </mat-toolbar-row>
        <!-- <mat-toolbar-row class="customToolbarRow">
           <app-people-paging fxFlexFill></app-people-paging>
        </mat-toolbar-row> -->
    </mat-toolbar>
    `
})
export class PeopleToolbarComponent implements OnInit, OnDestroy {
  peopleFiltersForm = new FormGroup({
    search: new FormGroup({
      query: new FormControl(''),
      location: new FormControl('')
    })
  });

  searchQuery$: Subscription = this.peopleFiltersForm
    .get('search.query')
    .valueChanges.pipe(
      debounceTime(600),
      skipWhile(
        query => this.peopleFiltersForm.get('search.query').invalid === true
      )
    )
    .subscribe(query => {
      this.peopleStore.dispatch(new fromPeople.UpdateSearchQuery(query));
    });

  searchLocation$: Subscription = this.peopleFiltersForm
    .get('search.location')
    .valueChanges.subscribe(location => {
      this.peopleStore.dispatch(new fromPeople.UpdateSearchLocation(location));
    });

  // comes from STORE.application.location
  // controlled from *HEADER select menu
  selectedLocation$: Subscription;

  constructor(
    private peopleStore: Store<fromPeople.PeopleState>,
    private rootStore: Store<fromRoot.RootState>
  ) {}

  ngOnInit() {
    // subscribe to store and update selected location on change
    this.selectedLocation$ = this.rootStore
      .select(fromRoot.getApplicationLocation)
      .subscribe(location => {
        console.log(location);
        this.peopleFiltersForm.get('search.location').setValue(location);
      });
  }

  ngOnDestroy() {
    this.selectedLocation$.unsubscribe();
    this.searchLocation$.unsubscribe();
    this.searchQuery$.unsubscribe();
  }
}
