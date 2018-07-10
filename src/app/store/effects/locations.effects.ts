import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// ngrx
import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as a_in_errors from '../actions/errors.actions';
import * as a_in_locations from '../actions/locations.actions';

import * as fromRoot from '..';

// rxjs
import { throwError, of, from } from 'rxjs';
import {
  map,
  mergeMap,
  reduce,
  switchMap,
  catchError,
  take,
  skip
} from 'rxjs/operators';

// services
import { LocationsService } from '../../shared/services/locations.service';

// constants
import { ApiPath } from '../../shared/constants';

// interfaces
import { LocationEnt } from '../../shared/interface/locations.model';

@Injectable()
export class LocationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromRoot.RootState>,
    private http: HttpClient,
    private locationsService: LocationsService
  ) {}

  @Effect()
  getLocations$ = this.actions$.pipe(
    ofType(a_in_locations.LocationsActionTypes.GET_LOCATIONS),
    switchMap((action: a_in_locations.GetLocations) => {
      return this.locationsService.getLocations().pipe(
        map((locations: LocationEnt[]) => {
          // console.log('received: ' + data);

          const locations$ = from(locations);
          const n_of_locations = Number(locations.length);

          let results: LocationEnt[] = [];

          locations$
            .pipe(
              take(n_of_locations),
              reduce((acc: LocationEnt[], curr: LocationEnt) => {
                return [...acc, { ...curr, id: curr.Id }];
              }, [])
            )
            .subscribe((res: LocationEnt[]) => {
              console.log(res);
              results = [...res];
            });

          return new a_in_locations.AddLocations({ locations: results });
        }),
        catchError((error: any) => of(new a_in_errors.DisplayError(error)))
      );
    })
  );

  // mirroring effect
  @Effect()
  updateSelected$ = this.actions$.pipe(
    ofType(a_in_locations.LocationsActionTypes.UPDATE_SELECTED),
    skip(1),
    map((action: a_in_locations.UpdateSelected) => {
      let ID;
      this.store
        .pipe(
          take(1),
          select(fromRoot.getUserId)
        )
        .subscribe((Id: number) => {
          ID = Id;
        });
      return { ID, LocationsOfInterestId: { results: action.payload } };
    }),
    switchMap((FKP: any) => {
      console.log(FKP);
      return from(this.locationsService.updateLocationsOfInterest(FKP));
    }),
    map((object: any) => {
      console.log(object);
      return new a_in_locations.UpdateSelectedSuccess();
    }),
    catchError((error: any) => of(new a_in_errors.DisplayError(error)))
  );
}
