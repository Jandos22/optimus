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
import * as fromOrders from '..';
import * as fromParamsActions from '../actions/params.actions';
import * as fromPaginationActions from '../actions/pagination.actions';
import * as fromOrdersActions from '../actions/orders.actions';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { OrdersService } from '../../services/orders.service';

// interfaces
import { SpResponse } from './../../../../shared/interface/sp-response.model';
import {
  OrderItem,
  OrdersSearchParams
} from '../../../../shared/interface/orders.model';

@Injectable()
export class SearchEffects {
  // when params change, then hold local copy
  // for use in count total (need refactor to use withLatestFrom)
  params: OrdersSearchParams;

  constructor(
    private store$: Store<fromOrders.OrdersState>,
    private actions$: Actions,
    private srv: OrdersService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  updateParams$ = this.actions$.pipe(
    ofType(fromParamsActions.ParamsActionTypes.UPDATE_PARAMS),
    map((action: fromParamsActions.UpdateParams) => {
      return action.params;
    }),
    withLatestFrom(this.store$.pipe(select(fromOrders.getParams))),
    map((merged: any[]) => {
      const prevParams = merged[0];
      const currParams = merged[1];
      const newParams = { ...prevParams, ...currParams };
      return newParams;
    }),
    map((params: OrdersSearchParams) => {
      this.params = params;
      return this.srv.buildUrl(params);
    }),
    mergeMap(url => {
      return [
        new fromPaginationActions.ResetPagination(),
        new fromPaginationActions.AddLink(url),
        new fromOrdersActions.SearchOrdersStart(url)
      ];
    })
  );

  @Effect() // BEGIN SEARCH
  searchOrdersStart$ = this.actions$.pipe(
    ofType(fromOrdersActions.OrdersActionTypes.SEARCH_START),
    withLatestFrom(this.store$.pipe(select(fromOrders.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromOrdersActions.SearchOrdersStart,
        currentIndex: merged[1] as number
      };
    }),
    switchMap(merged => {
      const getUsers$ = this.srv.getDataWithNext(merged.action.url);
      return getUsers$.pipe(
        mergeMap((response: SpResponse) => {
          // collection of actions that will be dispatched
          const dispatch = [];

          if (response.d.results.length) {
            // when users received, map them to add "id" property for @ngrx/entity
            const orders = _.reduce(
              response.d.results,
              function(acc: OrderItem[], item: OrderItem) {
                return [...acc, { ...item, id: item.ID }];
              },
              []
            );
            // if users exist and have length more than 0
            dispatch.push(new fromOrdersActions.SearchOrdersSuccess(orders));
            dispatch.push(
              new fromPaginationActions.UpdateTotalDisplayed(orders.length)
            );

            // if results have next page
            // then add its url to links array
            // and begin count for "totalExist"
            if (response.d.__next) {
              dispatch.push(
                new fromPaginationActions.AddLink(response.d.__next)
              );
              dispatch.push(new fromOrdersActions.CountOrdersTotal());
            } else {
              if (merged.currentIndex === 0) {
                dispatch.push(
                  new fromPaginationActions.UpdateTotalExist(orders.length)
                );
              }
            }
          } else {
            // if no users found
            dispatch.push(new fromOrdersActions.SearchOrdersNoResults());
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
    ofType(fromOrdersActions.OrdersActionTypes.COUNT_TOTAL),
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
      return new fromOrdersActions.SearchOrdersStart(action.url);
    })
  );

  @Effect()
  onBack$ = this.actions$.pipe(
    ofType(fromPaginationActions.PaginationActionTypes.ON_BACK),
    withLatestFrom(this.store$.pipe(select(fromOrders.getCurrentIndex))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromPaginationActions.OnBack,
        currentIndex: merged[1] as number
      };
    }),
    mergeMap(merged => {
      return [
        new fromOrdersActions.SearchOrdersStart(merged.action.url),
        new fromPaginationActions.RemoveLink(merged.currentIndex)
      ];
    })
  );
}
