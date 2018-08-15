import { Injectable } from '@angular/core';

// rxjs
import { of } from 'rxjs';

import {
  map,
  switchMap,
  mergeMap,
  catchError,
  withLatestFrom,
  skipUntil,
  skipWhile,
  skip
} from 'rxjs/operators';

// lodash
import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromRoot from '../../../../store';
import * as fromOrders from '..';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { OrdersFetchService } from './../../services/orders-fetch.service';

// interfaces
import { OrderStatus } from '../../../../shared/interface/orders.model';

@Injectable()
export class FetchEffects {
  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: OrdersFetchService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchToolNames$ = this.actions$.pipe(
    ofType(fromOrders.FetchActionTypes.FETCH_ORDER_STATUSES),
    switchMap(x => {
      return this.srv.getOrderStatuses().pipe(
        map(orderStatuses => {
          orderStatuses = _.map(orderStatuses, (orderStatus: OrderStatus) => {
            return { ...orderStatus, id: orderStatus.Id };
          });

          return new fromOrders.FetchOrderStatusesSuccess(orderStatuses);
        }),
        catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );
}
