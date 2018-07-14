import { Injectable } from '@angular/core';

// rxjs
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  take,
  reduce,
  withLatestFrom
} from 'rxjs/operators';

// lodash
import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromKaizen from '..';
import * as fromParamsActions from '../actions/params.actions';
import * as fromPaginationActions from '../actions/pagination.actions';
import * as fromProjectsActions from '../actions/projects.actions';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { KaizenService } from '../../services/kaizen.service';

// interfaces
import { SpResponse } from '../../../../models/sp-response.model';
import {
  KaizenProjectItem,
  KaizenSearchParams
} from '../../../../shared/interface/kaizen.model';

@Injectable()
export class SearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: KaizenSearchParams;

  constructor(
    private store$: Store<fromKaizen.KaizenState>,
    private actions$: Actions,
    private srv: KaizenService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    map((params: KaizenSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap(url => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromProjectsActions.SearchProjectsStart(url)
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  searchUsersStart$ = this.actions$.pipe(
    ofType(fromProjectsActions.ProjectsActionTypes.SEARCH_PROJECTS_START),
    withLatestFrom(this.store$.pipe(select(fromKaizen.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromProjectsActions.SearchProjectsStart,
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
            const projects = _.reduce(
              response.d.results,
              function(acc: KaizenProjectItem[], item: KaizenProjectItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(
              new fromProjectsActions.SearchProjectsSuccess(projects)
            );
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(projects.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromProjectsActions.CountProjectsTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(projects.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(new fromProjectsActions.SearchProjectsNoResults());
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
    ofType(fromProjectsActions.ProjectsActionTypes.COUNT_PROJECTS_TOTAL),
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
      return new fromProjectsActions.SearchProjectsStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromKaizen.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number
      };
    }),
    mergeMap(merged => {
      return [
        new fromProjectsActions.SearchProjectsStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex)
      ];
    })
  );
}
