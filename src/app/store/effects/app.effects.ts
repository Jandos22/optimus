import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// ngrx
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as a_in_app from '../actions/app.actions';
import * as a_in_errors from '../actions/errors.actions';

// rxjs
import { throwError, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

// constants
import { ApiPath } from './../../shared/constants/index';

// interfaces
import { Locations } from './../../models/locations.m';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private _title: Title
  ) {}

  @Effect()
  setTitle = this.actions$.pipe(
    ofType(a_in_app.CHANGE_APP_NAME),
    map((action: a_in_app.ChangeAppName) => {
      const title = action.payload;
      title === 'Home'
        ? this._title.setTitle('Optimus')
        : this._title.setTitle(title + ' - Optimus');
      return new a_in_app.SetAppName(title);
    })
  );

  @Effect()
  getLocations = this.actions$.pipe(
    ofType(a_in_app.GET_LOCATIONS),
    switchMap((action: a_in_app.GetLocations) => {
      return this.http
        .get(`${ApiPath}web/lists/getbytitle('NgLocations')/items`)
        .pipe(
          map((data: any) => {
            return new a_in_app.SetLocations(data.value);
          }),
          catchError((error: any) => of(new a_in_errors.DisplayError(error)))
        );
    })
  );
}
