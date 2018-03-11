import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { map, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';

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
  onSearchParamsChange$ = this.actions$
    .ofType(fromSearch.ON_SEARCH_PARAMS_CHANGE)
    .pipe(
      map((action: fromSearch.OnSearchParamsChange) => {
        return this.peopleService.buildUrlToGetPeople(action.params);
      }),
      map(__curr => {
        console.log(__curr);
        return new fromSearch.UpdateSearchUriCurrent(__curr);
      })
    );

  @Effect()
  startSearchPeople$ = this.actions$
    .ofType(fromSearch.START_SEARCH_PEOPLE)
    .pipe(
      map((action: fromSearch.StartSearchPeople) => action.url),
      switchMap((url: string) => {
        return this.peopleService.getPeopleWithGivenUrl(url).pipe(
          mergeMap(data => {
            const array = [];

            if (data.results) {
              array.push(new fromUsers.LoadUsersSuccess(data.results));
            }

            if (data.__next) {
              array.push(new fromSearch.UpdateSearchUriNext(data.__next));
            }

            return array;
          }),
          catchError(error => of(new fromUsers.LoadUsersFail(error)))
        );
      })
    );
}
