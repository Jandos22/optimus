// actions
import {
  GroupsActionTypes,
  GroupsActionsUnion
} from '../actions/groups.actions';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';
import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';

// compose reducer state shape here
export interface GroupsState {
  jobs: AppraisalGroupItem[];
}

// compose initial state here
export const initialState = {
  jobs: null
};

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: GroupsActionsUnion
): GroupsState {
  switch (action.type) {
    case GroupsActionTypes.GROUP_APPRAISALS_BY_JOBS_SUCCESS: {
      return { ...state, jobs: [...action.jobs] };
    }

    default:
      return state;
  }
}

export const getAppraisalGroups = (state: GroupsState) => state.jobs;
