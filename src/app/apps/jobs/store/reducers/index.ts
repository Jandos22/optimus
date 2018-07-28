import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromJobs from './jobs.reducer';
import * as fromToolNames from './tool-names.reducer';
import * as fromParams from './params.reducer';
import * as fromPagination from './pagination.reducer';

export interface JobsState {
  jobs: fromJobs.JobsState;
  toolNames: fromToolNames.ToolNamesState;
  params: fromParams.ParamsState;
  pagination: fromPagination.PaginationState;
}

export const reducers: ActionReducerMap<JobsState> = {
  jobs: fromJobs.reducer,
  toolNames: fromToolNames.reducer,
  params: fromParams.reducer,
  pagination: fromPagination.reducer
};

export const getJobsRootState = createFeatureSelector<JobsState>('jobs');
