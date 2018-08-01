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
import * as fromAppraisals from '..';
import * as fromParamsActions from '../actions/params.actions';
import * as fromPaginationActions from '../actions/pagination.actions';
import * as fromAppraisalsActions from '../actions/appraisals.actions';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { AppraisalsService } from '../../services/appraisals.service';

// interfaces
import { SpResponse } from './../../../../shared/interface/sp-response.model';
import {
  AppraisalItem,
  AppraisalsSearchParams
} from '../../../../shared/interface/appraisals.model';

@Injectable()
export class SearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: AppraisalsSearchParams;

  constructor(
    private store$: Store<fromAppraisals.AppraisalsState>,
    private actions$: Actions,
    private srv: AppraisalsService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    map((params: AppraisalsSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap(url => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromAppraisalsActions.SearchAppraisalsStart(url)
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  searchStart$ = this.actions$.pipe(
    ofType(fromAppraisalsActions.AppraisalsActionTypes.SEARCH_APPRAISALS_START),
    withLatestFrom(this.store$.pipe(select(fromAppraisals.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromAppraisalsActions.SearchAppraisalsStart,
        currentIndex: merged[1] as number
      };
    }),
    switchMap(merged => {
      const get$ = this.srv.getDataWithNext(merged.action.url);
      return get$.pipe(
        mergeMap((response: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          if (response.d.results.length) {
            // when users received, map them to add "id" property for @ngrx/entity
            const appraisals = _.reduce(
              response.d.results,
              function(acc: AppraisalItem[], item: AppraisalItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(
              new fromAppraisalsActions.SearchAppraisalsSuccess(appraisals)
            );
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(appraisals.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromAppraisalsActions.CountAppraisalsTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(appraisals.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(
              new fromAppraisalsActions.SearchAppraisalsNoResults()
            );
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
  countTotal$ = this.actions$.pipe(
    ofType(fromAppraisalsActions.AppraisalsActionTypes.COUNT_APPRAISALS_TOTAL),
    map(x => {
      return this.srv.buildUrl(this.params, true);
    }),
    switchMap(url => {
      return this.srv.getDataWithNext(url).pipe(
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
      return new fromAppraisalsActions.SearchAppraisalsStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromAppraisals.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number
      };
    }),
    mergeMap(merged => {
      return [
        new fromAppraisalsActions.SearchAppraisalsStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex)
      ];
    })
  );
}
