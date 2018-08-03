import { Injectable } from '@angular/core';

// rxjs
import { from, of } from 'rxjs';

// rxjs
import {
  tap,
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
import * as fromRightsActions from '../actions/rights.actions';

// interfaces
import { SpResponse } from './../../../../shared/interface/sp-response.model';

// ids of people positions
import { people_fefs } from '../../../../shared/constants/ids-fefs';
import { people_op } from '../../../../shared/constants/ids-op';
import { people_appraisal_reviewers } from './../../../../shared/constants/ids-appraisal-reviewers';

export interface AppraisalRights {
  isFEFS: boolean;
  isOP: boolean;
  isReviewer: boolean;
  isOther: boolean;
}

@Injectable()
export class RightsEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  checkRights$ = this.actions$.pipe(
    ofType(fromRightsActions.AppraisalsRightsActionTypes.CHECK_RIGHTS),
    map((action: fromRightsActions.CheckRights) => {
      const myposid = action.myPositionId;
      // initial state
      const rights: AppraisalRights = {
        isFEFS: false,
        isOP: false,
        isReviewer: false,
        isOther: true
      };

      const ifFEFS = _.find(people_fefs, (id: number) => id === myposid);
      const ifOP = _.find(people_op, (id: number) => id === myposid);
      const ifReviewer = _.find(
        people_appraisal_reviewers,
        (id: number) => id === myposid
      );

      if (ifFEFS) {
        return { ...rights, isFEFS: true, isOther: false };
      } else if (ifOP) {
        return { ...rights, isOP: true, isOther: false };
      } else if (ifReviewer) {
        return { ...rights, isReviewer: true, isOther: false };
      } else {
        return rights;
      }
    }),
    map(
      (rights: AppraisalRights) =>
        new fromRightsActions.CheckRightsSuccess(rights)
    )
  );
}
