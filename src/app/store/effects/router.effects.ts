import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Effect, Actions } from '@ngrx/effects';
import * as a_in_router from '../actions/router.actions';

import { map, tap } from 'rxjs/operators';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location
  ) {}

  @Effect({ dispatch: false })
  navigate$ = this.actions$.ofType(a_in_router.GO).pipe(
    map((action: a_in_router.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) => {
      this.router.navigate(path, { queryParams, ...extras });
    })
  );

  @Effect({ dispatch: false })
  navigateBack$ = this.actions$
    .ofType(a_in_router.BACK)
    .pipe(tap(() => this.location.back()));

  @Effect({ dispatch: false })
  navigateForward$ = this.actions$
    .ofType(a_in_router.FORWARD)
    .pipe(tap(() => this.location.forward()));
}
