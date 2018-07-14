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
import * as fromKaizen from '..';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { KaizenImpactTypeService } from '../../services/kaizen-impact-type.service';

// interfaces
import {
  KaizenProjectItem,
  KaizenSearchParams,
  KaizenImpactType
} from '../../../../shared/interface/kaizen.model';

@Injectable()
export class ImpactTypesEffects {
  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: KaizenImpactTypeService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchImpactTypes$ = this.actions$.pipe(
    ofType(fromKaizen.ImpactTypesActionTypes.FETCH_IMPACT_TYPES),
    switchMap(x => {
      return this.srv.getImpactTypes().pipe(
        map(impactTypes => {
          impactTypes = _.map(impactTypes, (impactType: KaizenImpactType) => {
            return { ...impactType, id: impactType.ID };
          });

          return new fromKaizen.FetchImpactTypesSuccess(impactTypes);
        }),
        catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );

  @Effect()
  fetchImpactTypesSuccess$ = this.actions$.pipe(
    ofType(fromKaizen.ImpactTypesActionTypes.FETCH_IMPACT_TYPES_SUCCESS),
    withLatestFrom(
      this.store$.pipe(select(fromRoot.getUserLocationAssignedId))
    ),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromKaizen.FetchImpactTypesSuccess,
        locationAssignedId: merged[1] as number
      };
    }),
    map(merged => {
      // this location assigned id of current user
      const id = merged.locationAssignedId;

      // start filtering for applicable impact types
      // iterate over ApplicableTo array and look
      // if its ID is equal to locationAssignedId
      // or if impact type is applicable globally
      const applicableTo = merged.action.impactTypes.filter(impactType => {
        const byLocationAssigned = _.find(impactType.ApplicableTo, { ID: id })
          ? true
          : false;
        const byLocationGlobal = _.find(impactType.ApplicableTo, {
          Title: 'Global'
        })
          ? true
          : false;
        return byLocationAssigned || byLocationGlobal ? true : false;
      });

      console.log(applicableTo);

      return new fromKaizen.FilteringApplicableImpactTypesSuccess(applicableTo);
    })
  );
}
