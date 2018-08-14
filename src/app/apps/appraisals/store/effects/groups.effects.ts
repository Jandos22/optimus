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
  // withLatestFrom,
  groupBy,
  toArray
} from 'rxjs/operators';

// lodash
import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromAppraisals from '..';
// import * as fromParamsActions from '../actions/params.actions';
import * as fromGroupsActions from '../actions/groups.actions';
import * as fromAppraisalsActions from '../actions/appraisals.actions';
// import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { AppraisalsService } from '../../services/appraisals.service';

// interfaces
import { SpResponse } from './../../../../shared/interface/sp-response.model';
import {
  AppraisalItem,
  AppraisalsSearchParams
} from '../../../../shared/interface/appraisals.model';

interface AppraisalGroup {
  [propName: number]: AppraisalItem[];
}

@Injectable()
export class GroupsEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  groupByJobs$ = this.actions$.pipe(
    ofType(fromGroupsActions.GroupsActionTypes.GROUP_APPRAISALS_BY_JOBS),
    map((action: fromAppraisals.SearchAppraisalsSuccess) => {
      // group all appraisals by job
      const GroupedByJobId: AppraisalGroup = _.groupBy(
        action.appraisals,
        (appraisal: AppraisalItem) => {
          return appraisal.Job.Id;
        }
      );

      // after getting object of type { JobId: appraisals[], ... }
      // convert to array
      const jobsArray = _.toArray(GroupedByJobId);

      // after getting array of appraisal arrays
      // map it into array of jobs
      // where each value object has appraisals property
      const jobsFlattened = _.flatMap(jobsArray, function(
        value: AppraisalItem[]
      ) {
        const appraisal = value[0];
        const Id = appraisal.JobId;
        const Well = appraisal.Job.Well;
        const Title = appraisal.Job.Title;
        const RigUpStart = appraisal.Job.RigUpStart;
        return { Id, Well, Title, RigUpStart, appraisals: value };
      });

      // now let's sort jobs/appraisal by job date in ascending order
      const jobsSorted = _.sortBy(jobsFlattened, job => {
        return job.RigUpStart;
      });

      // recent jobs should be first
      const jobsReversed = _.reverse(jobsSorted);

      console.log(jobsReversed);
      console.log(jobsFlattened);

      return jobsReversed;
    }),
    map(jobs => new fromGroupsActions.GroupAppraisalsByJobsSuccess(jobs))
  );
}
