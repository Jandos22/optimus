import { Injectable } from "@angular/core";

// rxjs
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  take,
  reduce,
  withLatestFrom,
} from "rxjs/operators";

// lodash
import * as _ from "lodash";

// ngrx
import { Store, select } from "@ngrx/store";
import { Effect, Actions, ofType } from "@ngrx/effects";
import * as fromJobs from "..";
import * as fromParamsActions from "../actions/params.actions";
import * as fromPaginationActions from "../actions/pagination.actions";
import * as fromJobsActions from "../actions/jobs.actions";
import * as fromErrorActions from "../../../../store/actions/errors.actions";

// services
import { JobsService } from "../../services/jobs.service";

// interfaces
import { SpResponse } from "./../../../../shared/interface/sp-response.model";
import {
  JobItem,
  JobsSearchParams,
} from "../../../../shared/interface/jobs.model";

@Injectable()
export class SearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: JobsSearchParams;

  constructor(
    private store$: Store<fromJobs.JobsState>,
    private actions$: Actions,
    private srv: JobsService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    withLatestFrom(this.store$.pipe(select(fromJobs.getParams))),
    map((merged: any[]) => {
      const prevParams = merged[0];
      const currParams = merged[1];
      const newParams = { ...prevParams, ...currParams };
      return newParams;
    }),
    map((params: JobsSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap((url) => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromJobsActions.SearchJobsStart(url),
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  searchJobsStart$ = this.actions$.pipe(
    ofType(fromJobsActions.JobsActionTypes.SEARCH_JOBS_START),
    withLatestFrom(this.store$.pipe(select(fromJobs.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromJobsActions.SearchJobsStart,
        currentIndex: merged[1] as number,
      };
    }),
    switchMap((merged) => {
      const getUsers$ = this.srv.getDataWithNext(merged.action.url);
      return getUsers$.pipe(
        mergeMap((response: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          if (response.d.results.length) {
            // when users received, map them to add "id" property for @ngrx/entity
            const jobs = _.reduce(
              response.d.results,
              function (acc: JobItem[], item: JobItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(new fromJobsActions.SearchJobsSuccess(jobs));
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(jobs.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromJobsActions.CountJobsTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(jobs.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(new fromJobsActions.SearchJobsNoResults());
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
    ofType(fromJobsActions.JobsActionTypes.COUNT_JOBS_TOTAL),
    map((x) => {
      return this.srv.buildUrl(this.params, true);
    }),
    switchMap((url) => {
      return this.srv.getDataWithNext(url).pipe(
        map((res: SpResponse) => {
          return new fromPaginationActions.UpdateTotalExist(
            res.d.results.length
          );
        })
      );
    })
  );

  @Effect()
  onNext$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_NEXT),
    map((action: fromPaginationActions.OnNext) => {
      return new fromJobsActions.SearchJobsStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromJobs.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number,
      };
    }),
    mergeMap((merged) => {
      return [
        new fromJobsActions.SearchJobsStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex),
      ];
    })
  );
}
