import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';

import * as searchActions from '../actions/search.action';
import * as usersActions from '../actions/users.action';

import * as fromServices from '../../services';

import { SearchUsers } from '../../models/search-users.m';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private usersService: fromServices.UsersService
  ) {}

  @Effect()
  triggerPeopleSearch$ = this.actions$
    .ofType(searchActions.TRIGGER_SEARCH)
    .pipe(
      map((action: searchActions.TriggerSearch) => action.payload),
      mergeMap(params => {
        return [
          new searchActions.UpdateSearchParams(params),
          new searchActions.StartPeopleSearch(params)
        ];
      })
    );

  @Effect()
  startPeopleSearch$ = this.actions$.ofType(searchActions.TRIGGER_SEARCH).pipe(
    map((action: searchActions.StartPeopleSearch) => action.payload),
    switchMap((search: SearchUsers) => {
      return this.usersService
        .getPeople(search.query, search.location)
        .pipe(
          map(users => new usersActions.LoadUsersSuccess(users)),
          catchError(error => of(new usersActions.LoadUsersFail(error)))
        );
    })
  );
}
