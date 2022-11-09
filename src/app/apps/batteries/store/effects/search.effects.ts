import { Injectable } from "@angular/core";

// rxjs
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  take,
  reduce,
  withLatestFrom
} from "rxjs/operators";

// lodash
import * as _ from "lodash";

// ngrx
import { Store, select } from "@ngrx/store";
import { Effect, Actions, ofType } from "@ngrx/effects";
import * as fromBatteries from "..";
import * as fromParamsActions from "../actions/params.actions";
import * as fromPaginationActions from "../actions/pagination.actions";
import * as fromBatteriesActions from "../actions/batteries.actions";
import * as fromErrorActions from "../../../../store/actions/errors.actions";

// services
import { BatteriesService } from "../../services/batteries.service";

// interfaces
import { SpResponse } from "./../../../../shared/interface/sp-response.model";
import {
  BatteryItem,
  BatteriesSearchParams
} from "../../../../shared/interface/batteries.model";

@Injectable()
export class SearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: BatteriesSearchParams;

  constructor(
    private store$: Store<fromBatteries.BatteriesState>,
    private actions$: Actions,
    private srv: BatteriesService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    withLatestFrom(this.store$.pipe(select(fromBatteries.getParams))),
    map((merged: any[]) => {
      const prevParams = merged[0];
      const currParams = merged[1];
      const newParams = { ...prevParams, ...currParams };
      return newParams;
    }),
    map((params: BatteriesSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap(url => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromBatteriesActions.SearchBatteriesStart(url)
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  searchBatteriesStart$ = this.actions$.pipe(
    ofType(fromBatteriesActions.BatteriesActionTypes.SEARCH_BATTERIES_START),
    withLatestFrom(this.store$.pipe(select(fromBatteries.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromBatteriesActions.SearchBatteriesStart,
        currentIndex: merged[1] as number
      };
    }),
    switchMap(merged => {
      const getBatteries$ = this.srv.getDataWithNext(merged.action.url);
      return getBatteries$.pipe(
        mergeMap((response: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          if (response.d.results.length) {
            // when users received, map them to add "id" property for @ngrx/entity
            const batteries = _.reduce(
              response.d.results,
              function(acc: BatteryItem[], item: BatteryItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(
              new fromBatteriesActions.SearchBatteriesSuccess(batteries)
            );
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(batteries.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromBatteriesActions.CountBatteriesTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(batteries.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(new fromBatteriesActions.SearchBatteriesNoResults());
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
    ofType(fromBatteriesActions.BatteriesActionTypes.COUNT_BATTERIES_TOTAL),
    map(x => {
      return this.srv.buildUrl(this.params, true);
    }),
    switchMap(url => {
      return this.srv.getDataWithNext(url).pipe(
        map((res: SpResponse) => {
            return new fromPaginationActions.UpdateTotalExist(res.d.results.length);
        })
      );
    })
  );

  @Effect()
  onNext$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_NEXT),
    map((action: fromPaginationActions.OnNext) => {
      return new fromBatteriesActions.SearchBatteriesStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromBatteries.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number
      };
    }),
    mergeMap(merged => {
      return [
        new fromBatteriesActions.SearchBatteriesStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex)
      ];
    })
  );
}
