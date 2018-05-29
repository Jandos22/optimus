import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../../store';

// rxjs
import { Observable, Subscription } from 'rxjs';

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
          <mat-select placeholder="Locations of interest" [formControl]="locations" [value]="locations" multiple>
            <mat-option *ngFor="let location of (locations_list$ | async)" [value]="location.Id">{{ location.Title }}</mat-option>
          </mat-select>
        </mat-form-field>
        <p class="my-hint__multiline">
          You will view data from these currently selected locations
        </p>
        <pre>{{locations.value | json}}</pre>
      </div>
      <div fxFlex fxLayout="column">
        <mat-form-field>
          <mat-select placeholder="Location of assignment" [formControl]="location" [value]="location">
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
export class HeaderLocationSelectorComponent implements OnDestroy {
  // location of assignment
  location: FormControl;
  // locations of interest
  locations: FormControl;

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

  constructor(
    private fb: FormBuilder,
    private s_in_root: Store<fromRoot.RootState>
  ) {
    this.initForm();

    this.locations_list$ = this.s_in_root.pipe(
      select(fromRoot.getAppLocations)
    );

    this.window$ = this.s_in_root
      .pipe(select(fromRoot.getLayoutWindow))
      .subscribe((window: WindowProperties) => (this.window = window));

    this.user$ = this.s_in_root
      .pipe(select(fromRoot.getUserState))
      .subscribe((user: UserState) => {
        this.user = user.optimus;
        this.location.setValue(this.user.locationAssigned);
        this.locations.setValue(this.user.locationsOfInterest);
      });
  }

  get layout() {
    return this.window.isXS || this.window.isXXS ? 'column' : 'row';
  }

  initForm() {
    this.location = this.fb.control('');
    this.locations = this.fb.control([]);
  }

  ngOnDestroy() {
    this.window$.unsubscribe();
    this.user$.unsubscribe();
  }
}
