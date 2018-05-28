import { ErrorDialogBoxComponent } from './shared/components/error-dialog-box/error-dialog-box.component';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from './store';
import * as a_in_app from './store/actions/app.actions';

// this fix is only required in iOS Safari
import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill';
viewportUnitsBuggyfill.init({
  refreshDebounceWait: 50,
  hacks: viewportUnitsBuggyfill.hacks
});

@Component({
  selector: 'app-root',
  template: `
    <app-layout></app-layout>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  errors$: Subscription;
  error: boolean;

  constructor(
    private s_in_root: Store<fromRoot.RootState>,
    public dialog: MatDialog
  ) {
    this.errors$ = this.s_in_root
      .pipe(select(fromRoot.getErrorsList))
      .subscribe(x => {
        console.log(x);
        // x.length ? this.openErrorDialogBox(x) : (this.error = false);
      });
  }

  ngOnInit() {
    this.s_in_root.dispatch(new a_in_app.GetLocations());
  }

  openErrorDialogBox(error: any[]) {
    this.dialog.open(ErrorDialogBoxComponent, {
      data: error
    });
  }
}
