import { ApiPath } from './../../constants/index';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// rxjs
import { throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromApplication from '../actions/app.actions';

import { Locations } from './../../models/locations.m';

@Injectable()
export class ApplicationEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private _title: Title
  ) {}

  @Effect()
  setTitle = this.actions$.pipe(
    ofType(fromApplication.CHANGE_APP_NAME),
    map((action: fromApplication.ChangeAppName) => {
      const title = action.payload;
      title === 'Home'
        ? this._title.setTitle('Optimus')
        : this._title.setTitle(title + ' - Optimus');
      return new fromApplication.SetAppName(title);
    })
  );

  @Effect()
  getLocations = this.actions$.ofType(fromApplication.GET_LOCATIONS).pipe(
    switchMap((action: fromApplication.GetLocations) => {
      return this.http.get(
        `${ApiPath}web/lists/getbytitle('NgLocations')/items`
      );
      // return sprLib.list('NgLocations').getItems(['Id', 'Location']);
    }),
    map((data: any) => {
      return new fromApplication.SetLocations(data.value);
    }),
    catchError((error: any) => throwError(error.json()))
  );
}
