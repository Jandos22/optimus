// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import { JobsActionTypes, JobsActionsUnion } from '../actions/jobs.actions';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';

// compose reducer state shape here
export interface JobsState extends EntityState<JobItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<JobItem> = createEntityAdapter<JobItem>({});

// compose initial state here
export const initialState: JobsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: JobsActionsUnion
): JobsState {
  switch (action.type) {
    case JobsActionTypes.SEARCH_JOBS_START: {
      return { ...state, searching: true };
    }

    case JobsActionTypes.SEARCH_JOBS_SUCCESS: {
      const adapted = adapter.addAll(action.jobs, state);
      return { ...adapted, searching: false };
    }

    case JobsActionTypes.SEARCH_JOBS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case JobsActionTypes.INSERT_ONE_JOB: {
      const job = action.job;
      const ids = [job.ID, ...state.ids] as string[] | number[];
      const entities = { [job.ID]: job, ...state.entities };
      return { ...state, ids, entities };
    }

    case JobsActionTypes.ADD_ONE_JOB: {
      return adapter.addOne(action.job, state);
    }

    case JobsActionTypes.UPDATE_ONE_JOB: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectJobsIds,
  selectEntities: selectJobsEntities,
  selectAll: selectAllJobs,
  selectTotal: selectJobsTotal
} = adapter.getSelectors();

export const getJobsSearching = (state: JobsState) => state.searching;
