import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import * as fromApplication from '../actions/application.action';

import * as sprLib from 'sprestlib';

import { Locations } from './../../models/locations.m';

@Injectable()
export class ApplicationEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private _title: Title
  ) {}

  @Effect()
  setTitle = this.actions$.ofType(fromApplication.CHANGE_APP_NAME).pipe(
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
      return sprLib.list('NgLocations').getItems(['Id', 'Location']);
    }),
    map((data: Locations[]) => {
      return new fromApplication.SetLocations(data);
    })
  );
}
