import { Injectable } from '@angular/core';

// ngrx
import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// rxjs
import { of, from } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  take,
  reduce
} from 'rxjs/operators';

// actions
import * as fromSearchActions from '../actions/search.actions';
import * as fromParamsActions from '../actions/params.actions';
import * as fromPaginationActions from '../actions/pagination.actions';
import * as fromEventsActions from '../actions/events.actions';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { TimelineService } from '../../services/timeline.service';

// constants
import { WirelinePath, ApiPath } from './../../../../shared/constants/index';

// interfaces
import { SpResponse } from './../../../../models/sp-response.model';
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private srv: TimelineService) {}

  // when params change:
  // reset pagination and get new url
  @Effect() // UPDATE PARAMS
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    mergeMap(params => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromSearchActions.GetNewUrl(params)
      ];
    })
  );

  // when receive new url
  // start new page (index 0 and only one link)
  // start new search with new url
  @Effect() // GET NEW URL
  getNewUrl$ = this.actions$.pipe(
    ofType(fromSearchActions.SearchActionTypes.GET_NEW_URL),
    map((action: fromSearchActions.GetNewUrl) => {
      return this.srv.buildUrl(action.params);
    }),
    switchMap(url => {
      return [
        new fromPaginationActions.StartNewPage(url),
        new fromSearchActions.BeginSearch(url),
        new fromEventsActions.SearchTrue()
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  beginSearch$ = this.actions$.pipe(
    ofType(fromSearchActions.SearchActionTypes.BEGIN_SEARCH),
    map((action: fromSearchActions.BeginSearch) => action.url),
    switchMap((url: string) => {
      // send request to server via service
      return this.srv.getDataWithGivenUrl(url).pipe(
        mergeMap((res: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          // if results are not empty, then update events list
          if (res.d.results) {
            let users: TimelineEventItem[] = [];
            const users$ = from(res.d.results);
            users$
              .pipe(
                take(res.d.results.length),
                reduce((acc: TimelineEventItem[], curr: TimelineEventItem) => {
                  const current: TimelineEventItem = { ...curr, id: curr.Id };
                  return [...acc, { ...current }];
                }, [])
              )
              .subscribe((u: TimelineEventItem[]) => {
                console.log(u);
                users = [...u];
              });

            dispatch.push(
              new fromEventsActions.LoadTimelineEventsSuccess(users)
            );
            dispatch.push(new fromEventsActions.SearchFalse());
          }

          // if results have next page, then add its url to links array
          if (res.d.__next) {
            dispatch.push(new fromPaginationActions.AddNextLink(res.d.__next));
          } else {
            dispatch.push(new fromPaginationActions.NoNextLink());
          }

          // dispatched several actions using mergeMap
          return dispatch;
        }),
        // if http call returns error, then dialog box will pop up
        // user can close and continue working with toolbar methods
        catchError((error: any) => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );

  @Effect() // ON NEXT
  onNext$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_NEXT),
    map((action: fromPaginationActions.OnNext) => {
      return new fromSearchActions.BeginSearch(action.url);
    })
  );

  @Effect() // ON BACK
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    map((action: fromPaginationActions.OnBack) => {
      return new fromSearchActions.BeginSearch(action.url);
    })
  );

  @Effect() // ON BEGIN COUNT
  onBeginCount$ = this.actions$.pipe(
    ofType(fromSearchActions.SearchActionTypes.BEGIN_COUNT),
    map((action: fromSearchActions.BeginCount) => {
      return this.srv.buildUrl(action.params, true);
    }),
    switchMap(url => {
      return this.srv.getDataWithGivenUrl(url).pipe(
        map((res: SpResponse) => {
          if (res.d.results.length === 0) {
            return new fromEventsActions.UpdateTotalItems(0);
          } else if (res.d.results.length <= 500 && !res.d.__next) {
            return new fromEventsActions.UpdateTotalItems(res.d.results.length);
          } else {
            return new fromEventsActions.UpdateTotalItems('500+');
          }
        })
      );
    })
  );
}
