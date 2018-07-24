import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromJobs from '../reducers/jobs.reducer';

// select sub-feature state
export const getJobsState = createSelector(
  fromFeature.getJobsRootState,
  (state: fromFeature.JobsState) => state.jobs
);

// selectors

export const getJobsSearching = createSelector(
  getJobsState,
  fromJobs.getJobsSearching
);

export const selectAllJobs = createSelector(
  getJobsState,
  fromJobs.selectAllJobs
);

export const selectTotalDisplayedJobs = createSelector(
  getJobsState,
  fromJobs.selectJobsTotal
);
