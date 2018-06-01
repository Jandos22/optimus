import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../../store';

import * as a_in_locations from '../../../store/actions/locations.actions';
import * as a_in_user from '../../../store/actions/user.actions';

// rxjs
import { Observable, Subscription } from 'rxjs';
import { take, pairwise } from 'rxjs/operators';

// interfaces
import { WindowProperties } from './../../../models/window-properties.m';
import { OptimusUser, UserState } from '../../../shared/interface/user.model';

@Component({
  selector: 'app-header-location-selector',
  styleUrls: ['header-location-selector.component.scss'],
  template: `
    <h3 mat-dialog-title>Select Location(s)</h3>
    <div mat-dialog-content [fxLayout]="layout" fxLayoutGap="16px">
      <div fxFlex fxLayout="column">
        <mat-form-field>
          <mat-select placeholder="Locations of interest" [formControl]="fc_locations" [value]="fc_locations.value" multiple>
            <!-- if only one option selected,
                 then disable it, so that at least one option always selected -->
            <mat-option *ngFor="let location of (locations_list$ | async)" [value]="location.Id"
              [disabled]="(isSingle && (selectedId === location.Id))"
              >
              {{ location.Title }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <p class="my-hint__multiline">
          You will view data from these currently selected locations
        </p>
      </div>
      <div fxFlex fxLayout="column">
        <mat-form-field>
          <mat-select placeholder="Location of assignment" [formControl]="fc_location">
            <mat-option *ngFor="let location of (locations_list$ | async)" [value]="location.Id">{{ location.Title }}</mat-option>
          </mat-select>
        </mat-form-field>
        <p class="my-hint__multiline">
          You will appear in all lists related to currently selected location
        </p>
      </div>
    </div>
    `
})
export class HeaderLocationSelectorComponent implements OnInit, OnDestroy {
  // location of assignment
  fc_location: FormControl;
  // locations of interest
  fc_locations: FormControl;

  // observe list from store
  locations_list$: Observable<any[]>;

  // subscribe to root.layout.window changes
  // then sync local window state
  window$: Subscription;
  window: WindowProperties;

  // subscribe to root.user
  // thenn sync local user
  user$: Subscription;
  user: OptimusUser;

  // subscriptions to react on form control value changes
  fc_locations$: Subscription;

  constructor(
    private fb: FormBuilder,
    private s_in_root: Store<fromRoot.RootState>
  ) {
    this.initForm();

    this.locations_list$ = this.s_in_root.pipe(
      select(fromRoot.selectAllLocations)
    );

    this.window$ = this.s_in_root
      .pipe(select(fromRoot.getLayoutWindow))
      .subscribe((window: WindowProperties) => (this.window = window));

    this.user$ = this.s_in_root
      .pipe(take(1), select(fromRoot.getUserState))
      .subscribe((user: UserState) => {
        this.user = user.optimus;
        console.log(user);
        this.fc_location.setValue(this.user.locationAssigned);
        this.fc_locations.setValue(this.user.locationsOfInterest);
      });

    // update selected locations in store whenever form control changes
    this.fc_locations$ = this.fc_locations.valueChanges.subscribe(ids => {
      this.s_in_root.dispatch(new a_in_locations.UpdateSelected(ids));
      this.s_in_root.dispatch(new a_in_user.UpdateUserLocationsOfInterest(ids));
    });
  }

  ngOnInit() {}

  get layout() {
    return this.window.isXS || this.window.isXXS ? 'column' : 'row';
  }

  get n_of_selected() {
    const n: number = this.fc_locations.value.length;
    return n;
  }

  // isSingle and selectedId are used to disable mat-option
  //

  get isSingle() {
    const n_of_selected = this.fc_locations.value.length;
    return n_of_selected === 1 ? true : false;
  }

  get selectedId() {
    const n_of_selected = this.fc_locations.value.length;
    return n_of_selected === 1 ? this.fc_locations.value[0] : 0;
  }

  initForm() {
    this.fc_location = this.fb.control({ value: '', disabled: true });
    this.fc_locations = this.fb.control([]);
  }

  ngOnDestroy() {
    this.window$.unsubscribe();
    this.user$.unsubscribe();
    this.fc_locations$.unsubscribe();
  }
}
