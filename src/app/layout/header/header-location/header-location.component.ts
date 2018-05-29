import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

// material
import { MatDialog } from '@angular/material';

// component for dialog box
import { HeaderLocationSelectorComponent } from './../header-location-selector/header-location-selector.component';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../../store';

// rxjs
import { Observable, Subscription } from 'rxjs';

// interfaces
import { OptimusUser, UserState } from '../../../shared/interface/user.model';

@Component({
  selector: 'app-header-location',
  styleUrls: ['header-location.component.scss'],
  template: `
    <button mat-button class="my-mat-button__small"
      (click)="openLocationSelector()">
      KZTZ
    </button>
    `
})
export class HeaderLocationComponent implements OnDestroy {
  user$: Subscription;
  user: OptimusUser;

  constructor(
    private dialog: MatDialog,
    private s_in_root: Store<fromRoot.RootState>
  ) {
    this.user$ = this.s_in_root
      .pipe(select(fromRoot.getUserState))
      .subscribe((user: UserState) => (this.user = user.optimus));
  }

  openLocationSelector() {
    this.dialog.open(HeaderLocationSelectorComponent, {
      minWidth: '80%',
      minHeight: '60%'
    });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
