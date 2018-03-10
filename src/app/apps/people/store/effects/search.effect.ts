import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';

import * as fromSearch from '../actions/search.action';
import * as fromUsers from '../actions/users.action';

import * as fromServices from '../../services';

import { SearchUsers } from '../../models/search-users.m';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private peopleService: fromServices.PeopleService
  ) {}

  @Effect()
  startSearchPeople$ = this.actions$
    .ofType(fromSearch.START_SEARCH_PEOPLE)
    .pipe(
      map((action: fromSearch.StartSearchPeople) => action.payload),
      switchMap((search: SearchUsers) => {
        return this.peopleService
          .getPeople(search.location, search.query)
          .pipe(
            map(people => new fromUsers.LoadUsersSuccess(people)),
            catchError(error => of(new fromUsers.LoadUsersFail(error)))
          );
      })
    );
}
