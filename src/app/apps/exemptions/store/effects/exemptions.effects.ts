import { ExemptionsModule } from './../../exemptions.module';
import { Injectable } from '@angular/core';

// ngrx
import { Effect, Actions, ofType } from '@ngrx/effects';

// rxjs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  take
} from 'rxjs/operators';

// actions
import {
  ExemptionsActionTypes,
  ExemptionsActionsUnion
} from '../actions/exemptions.actions';

// services
import { ExemptionsService } from './../../services/exemptions.service';

@Injectable()
export class ExemptionsEffects {
  constructor(private actions$: Actions, private service: ExemptionsService) {}

  @Effect({ dispatch: false })
  getExemptions$ = this.actions$.pipe(
    ofType(ExemptionsActionTypes.GET_EXEMPTIONS),
    map((action: ExemptionsActionsUnion) => action.payload),
    switchMap((location: string) => {
      return this.service.getExemptionsOfLocation(location);
    }),
    map(exemptions => {
      console.log(exemptions);
    })
  );
}
