import { Injectable } from '@angular/core';

// rxjs
import { map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';

// lodash
import * as _ from 'lodash';
// import { reduce } from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromPeople from '../index';
import * as fromParamsActions from '../actions/params.action';
import * as fromPaginationActions from '../actions/pagination.actions';
import * as fromUsersActions from '../actions/users.action';

// services
import { PeopleService } from '../../services/people.service';

// interfaces
import {
  PeopleItem,
  UserSearchParams
} from './../../../../shared/interface/people.model';
import { SpResponse } from './../../../../models/sp-response.model';

@Injectable()
export class UsersSearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: UserSearchParams;

  constructor(
    private store$: Store<fromPeople.PeopleState>,
    private actions$: Actions,
    private srv: PeopleService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    map((params: UserSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap(url => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromUsersActions.SearchUsersStart(url)
      ];
    })
  );

  @Effect()
  searchUsersStart$ = this.actions$.pipe(
    ofType(fromUsersActions.UsersActionTypes.SEARCH_USERS_START),
    withLatestFrom(this.store$.pipe(select(fromPeople.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromUsersActions.SearchUsersStart,
        currentIndex: merged[1] as number
      };
    }),
    switchMap(merged => {
      const getUsers$ = this.srv.getDataWithGivenUrl(merged.action.url);
      return getUsers$.pipe(
        mergeMap((response: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          if (response.d.results.length) {
            // when users received, map them to add "id" property for @ngrx/entity
            const users = _.reduce(
              response.d.results,
              function(acc: PeopleItem[], item: PeopleItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(new fromUsersActions.SearchUsersSuccess(users));
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(users.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromUsersActions.CountUsersTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(users.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(new fromUsersActions.SearchUsersNoResults());
            dispatch.push(new fromPaginationActions.UpdateTotalDisplayed(0));
            dispatch.push(new fromPaginationActions.UpdateTotalExist(0));
          }

          // dispatched several actions using mergeMap
          return dispatch;
        })
      );
    })
  );

  @Effect()
  countUsersTotal$ = this.actions$.pipe(
    ofType(fromUsersActions.UsersActionTypes.COUNT_USERS_TOTAL),
    map(x => {
      return this.srv.buildUrl(this.params, true);
    }),
    switchMap(url => {
      return this.srv.getDataWithGivenUrl(url).pipe(
        map((res: SpResponse) => {
          if (res.d.results.length === 0) {
            return new fromPaginationActions.UpdateTotalExist(0);
          } else if (res.d.results.length <= 500 && !res.d.__next) {
            return new fromPaginationActions.UpdateTotalExist(
              res.d.results.length
            );
          }
        })
      );
    })
  );

  @Effect()
  onNext$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_NEXT),
    map((action: fromPaginationActions.OnNext) => {
      return new fromUsersActions.SearchUsersStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromPeople.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number
      };
    }),
    mergeMap(merged => {
      return [
        new fromUsersActions.SearchUsersStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex)
      ];
    })
  );
}
