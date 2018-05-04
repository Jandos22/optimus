import { Injectable } from '@angular/core';

// ngrx
import { Effect, Actions } from '@ngrx/effects';

// rxjs
import { of } from 'rxjs';
import { map, switchMap, mergeMap, catchError, tap } from 'rxjs/operators';

// actions
import * as fromSearch from '../actions/search.actions';
import * as fromParams from '../actions/params.action';
import * as fromPagination from '../actions/pagination.action';
import * as fromNgPeople from '../actions/ng-people.action';

// services
import { PeopleService } from '../../services/people.service';

// constants
import { WirelinePath, ApiPath } from './../../../../constants/index';

// interfaces
import { SearchUsers } from '../../models/search-users.m';
import { SpResponse } from './../../../../models/sp-response.model';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private peopleService: PeopleService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.ofType(fromParams.UPDATE_PARAMS).pipe(
    map((action: fromParams.UpdateParams) => {
      return action.params;
    }),
    mergeMap(params => {
      return [
        new fromPagination.ResetPagination(),
        new fromSearch.GetNewUrl(params)
      ];
    })
  );

  // when receive new url
  // start new page (index 0 and one only link)
  // start new search with new url
  @Effect()
  getNewUrl$ = this.actions$.ofType(fromSearch.GET_NEW_URL).pipe(
    map((action: fromSearch.GetNewUrl) => {
      return this.peopleService.buildUrlToGetPeople(action.params);
    }),
    switchMap(url => {
      return [
        new fromPagination.StartNewPage(url),
        new fromSearch.BeginSearch(url),
        new fromNgPeople.SearchTrue()
      ];
    })
  );

  @Effect()
  beginSearch$ = this.actions$.ofType(fromSearch.BEGIN_SEARCH).pipe(
    map((action: fromSearch.BeginSearch) => action.url),
    switchMap((url: string) => {
      // send request to server via service
      return this.peopleService.getPeopleWithGivenUrl(url).pipe(
        mergeMap((res: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          // if results are not empty, then update NgPeople list
          if (res.d.results) {
            dispatch.push(new fromNgPeople.UpdatePeopleList(res.d.results));
            dispatch.push(new fromNgPeople.SearchFalse());
          }

          // if results have next page, then add its url to links array
          if (res.d.__next) {
            dispatch.push(new fromPagination.AddNextLink(res.d.__next));
          } else {
            dispatch.push(new fromPagination.NoNextLink());
          }

          // dispatched several actions using mergeMap
          return dispatch;
        }),
        catchError(error => of(new fromNgPeople.ErrorGetPeople(error)))
      );
    })
  );

  @Effect()
  onNext$ = this.actions$.ofType(fromPagination.ON_NEXT).pipe(
    map((action: fromPagination.OnNext) => {
      return new fromSearch.BeginSearch(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.ofType(fromPagination.ON_BACK).pipe(
    map((action: fromPagination.OnBack) => {
      return new fromSearch.BeginSearch(action.url);
    })
  );

  @Effect()
  onBeginCount$ = this.actions$.ofType(fromSearch.BEGIN_COUNT).pipe(
    map((action: fromSearch.BeginCount) => {
      return this.peopleService.buildUrlToGetPeople(action.params, true);
    }),
    switchMap(url => {
      return this.peopleService.getPeopleWithGivenUrl(url).pipe(
        map((res: SpResponse) => {
          if (res.d.results.length === 0) {
            return new fromNgPeople.UpdateTotalItems(0);
          } else if (res.d.results.length <= 500 && !res.d.__next) {
            return new fromNgPeople.UpdateTotalItems(res.d.results.length);
          } else {
            return new fromNgPeople.UpdateTotalItems('500+');
          }
        })
      );
    })
  );
}
