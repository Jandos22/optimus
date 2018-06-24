import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// ngrx
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as a_in_app from '../actions/app.actions';
import * as a_in_errors from '../actions/errors.actions';
import * as a_in_locations from './../actions/locations.actions';

// rxjs
import { throwError, of, from } from 'rxjs';
import {
  map,
  mergeMap,
  reduce,
  switchMap,
  catchError,
  take
} from 'rxjs/operators';

// services
import { LocationsService } from './../../shared/services/locations.service';

// constants
import { ApiPath } from './../../shared/constants/index';

// interfaces
import { Locations } from './../../models/locations.m';
import {
  LocationSp,
  LocationEnt
} from '../../shared/interface/locations.model';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private _title: Title,
    private locationsService: LocationsService
  ) {}

  @Effect()
  setTitle = this.actions$.pipe(
    ofType(a_in_app.CHANGE_APP_NAME),
    map((action: a_in_app.ChangeAppName) => {
      const title = action.payload;
      title === 'Timeline'
        ? this._title.setTitle('Optimus')
        : this._title.setTitle(title + ' - Optimus');
      return new a_in_app.SetAppName(title);
    })
  );
}
