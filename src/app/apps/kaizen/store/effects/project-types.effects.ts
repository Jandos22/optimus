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
import { KaizenProjectTypeService } from '../../services/kaizen-project-type.service';

// interfaces
import {
  KaizenProjectItem,
  KaizenSearchParams,
  KaizenProjectType
} from '../../../../shared/interface/kaizen.model';

@Injectable()
export class ProjectTypesEffects {
  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: KaizenProjectTypeService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchProjectTypes$ = this.actions$.pipe(
    ofType(fromKaizen.ProjectTypesActionTypes.FETCH_PROJECT_TYPES),
    switchMap(x => {
      return this.srv.getProjectTypes().pipe(
        map(projectTypes => {
          projectTypes = _.map(
            projectTypes,
            (projectType: KaizenProjectType) => {
              return { ...projectType, id: projectType.ID };
            }
          );

          return new fromKaizen.FetchProjectTypesSuccess(projectTypes);
        }),
        catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchProjectTypesSuccess$ = this.actions$.pipe(
    ofType(fromKaizen.ProjectTypesActionTypes.FETCH_PROJECT_TYPES_SUCCESS),
    withLatestFrom(
      this.store$.pipe(select(fromRoot.getUserLocationAssignedId))
    ),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromKaizen.FetchProjectTypesSuccess,
        locationAssignedId: merged[1] as number
      };
    }),
    map(merged => {
      // this location assigned id of current user
      const id = merged.locationAssignedId;

      // start filtering for applicable project types
      // iterate over ApplicableTo array and look
      // if its ID is equal to locationAssignedId
      // or if project type is applicable globally
      const applicableTo = merged.action.projectTypes.filter(projectType => {
        const byLocationAssigned = _.find(projectType.ApplicableTo, { ID: id })
          ? true
          : false;
        const byLocationGlobal = _.find(projectType.ApplicableTo, {
          Title: 'Global'
        })
          ? true
          : false;
        return byLocationAssigned || byLocationGlobal ? true : false;
      });

      console.log(applicableTo);

      return new fromKaizen.FilteringApplicableProjectTypesSuccess(
        applicableTo
      );
    })
  );

  mapIds(projectType: KaizenProjectType) {
    return { ...projectType, id: projectType.ID };
  }
}
