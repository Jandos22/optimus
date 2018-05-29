import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

// material
import { MatDialog } from '@angular/material';

// component for dialog box
import { HeaderLocationSelectorComponent } from './../header-location-selector/header-location-selector.component';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../../store';
import * as fromLocations from '../../../store/reducers/locations.reducer';

// rxjs
import { Observable, Subscription } from 'rxjs';

// interfaces
import { OptimusUser, UserState } from '../../../shared/interface/user.model';
import { LocationEnt } from '../../../shared/interface/locations.model';

@Component({
  selector: 'app-header-location',
  styleUrls: ['header-location.component.scss'],
  template: `
    <button mat-button class="my-mat-button__small"
      (click)="openLocationSelector()">
      {{ displayLocation }}
    </button>
    `
})
export class HeaderLocationComponent implements OnDestroy {
  user$: Subscription;
  user: OptimusUser;

  locations$: Subscription;
  locations: LocationEnt[];

  constructor(
    private dialog: MatDialog,
    private s_in_root: Store<fromRoot.RootState>
  ) {
    this.user$ = this.s_in_root
      .pipe(select(fromRoot.getUserState))
      .subscribe((user: UserState) => (this.user = user.optimus));

    this.locations$ = s_in_root
      .pipe(select(fromRoot.getSelectedLocations))
      .subscribe((locations: LocationEnt[]) => {
        this.locations = locations;
      });
  }

  openLocationSelector() {
    this.dialog.open(HeaderLocationSelectorComponent, {
      minWidth: '80%',
      minHeight: '60%'
    });
  }

  get displayLocation(): string | null {
    const n_of_locations = this.locations.length;
    return n_of_locations === 0
      ? null
      : n_of_locations === 1
        ? this.locations[0].Title
        : n_of_locations > 1
          ? `${this.locations[0].Title} ...`
          : null;
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
