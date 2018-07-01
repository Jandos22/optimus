import { Injectable } from '@angular/core';

// angular material
import { MatDialog } from '@angular/material';

// ngrx
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as a_in_errors from '../actions/errors.actions';

// rxjs
import { tap, map } from 'rxjs/operators';

// component for dialog box
import { ErrorDialogBoxComponent } from '../../shared/components/error-dialog-box/error-dialog-box.component';

@Injectable()
export class ErrorsEffects {
  constructor(private actions$: Actions, public dialog: MatDialog) {}

  @Effect({
    dispatch: false
  })
  displayError = this.actions$.pipe(
    ofType(a_in_errors.DISPLAY_ERROR),
    map((action: a_in_errors.DisplayError) => action.payload),
    tap(error => {
      this.dialog.open(ErrorDialogBoxComponent, {
        data: error
      });
    })
  );
}
