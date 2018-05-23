import { Injectable } from '@angular/core';

// ngrx
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// rxjs
import { of, Observable, forkJoin, from } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  catchError,
  tap,
  take,
  reduce,
  filter,
  takeWhile
} from 'rxjs/operators';

// actions
import {
  ExemptionsActionTypes,
  ExemptionsActionsUnion
} from '../actions/exemptions.actions';

import * as ActionsInExemptions from '../actions/exemptions.actions';

// services
import { ExemptionsService } from './../../services/exemptions.service';
import {
  Exemption,
  ExemptionsRaw,
  ExemptionGroup,
  ExemptionsGrouped
} from '../../../../shared/interface/exemptions.model';

@Injectable()
export class ExemptionsEffects {
  constructor(private actions$: Actions, private service: ExemptionsService) {}

  @Effect()
  // @Effect({ dispatch: false })
  getExemptions$ = this.actions$.pipe(
    ofType(ExemptionsActionTypes.GET_EXEMPTIONS),
    map((action: ExemptionsActionsUnion) => action.payload),
    switchMap((location: string) => {
      const exemption_groups$ = this.service.getExemptionsGroupsOfLocation(
        location
      );
      const exemptions$ = this.service.getExemptionsOfLocation(location);
      return forkJoin(exemption_groups$, exemptions$);
    }),
    map((data: any[]) => {
      console.log(data);
      return new ActionsInExemptions.MapExemptions(data);
    })
  );

  @Effect()
  // @Effect({ dispatch: false })
  mapExemptions$ = this.actions$.pipe(
    ofType(ExemptionsActionTypes.MAP_EXEMPTIONS),
    map((action: ExemptionsActionsUnion) => action.payload),
    map((data: [ExemptionGroup[], Exemption[]]) => {
      const groups$: Observable<ExemptionGroup> = from(data[0]);
      const number_of_groups = Number(data[0].length);

      const exemptions$: Observable<Exemption> = from(data[1]);
      const number_of_exemptions = Number(data[1].length);

      let results: ExemptionsGrouped[] = [];

      console.log('groups: ', number_of_groups);
      console.log('exemptions: ', number_of_exemptions);

      groups$
        .pipe(
          take(number_of_groups),
          reduce((acc: ExemptionsGrouped[], group: ExemptionGroup) => {
            let current_exemptions = [];
            exemptions$
              .pipe(
                take(number_of_exemptions),
                filter((exemption: Exemption) => {
                  return exemption.Groups.indexOf(group.Title) !== -1;
                }),
                reduce(
                  (acc_exemptions: Exemption[], val_exemption: Exemption) => {
                    return [...acc_exemptions, val_exemption];
                  },
                  []
                )
              )
              .subscribe(x => (current_exemptions = x));

            return [
              ...acc,
              { group: group.Title, exemptions: current_exemptions }
            ];
          }, [])
        )
        .subscribe(x => (results = x));

      return new ActionsInExemptions.UpdateExemptionsList(results);
    })
  );
}
