import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { of } from 'rxjs/observable/of';
import { map, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';

import * as fromSearch from '../actions/search.action';
import * as fromUsers from '../actions/users.action';

import * as fromServices from '../../services';

// constants
import { WirelinePath, ApiPath } from './../../../../constants/index';

// interfaces
import { SearchUsers } from '../../models/search-users.m';
import { SpResponse } from './../../../../models/sp-response.model';

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
          mergeMap((res: SpResponse) => {
            const array = [];

            if (res.d.results) {
              array.push(new fromUsers.LoadUsersSuccess(res.d.results));
            }

            if (res.d.__next) {
              let url = res.d.__next;

              // for development mode url need to start with '_api/'
              if (url.startsWith(WirelinePath) && ApiPath === '_api/') {
                url = url.replace(WirelinePath + '/', '');
              }

              array.push(new fromSearch.UpdateSearchUriNext(url));
            } else {
              array.push(new fromSearch.UpdateSearchUriNext(''));
            }

            return array;
          }),
          catchError(error => of(new fromUsers.LoadUsersFail(error)))
        );
      })
    );
}
