// actions
import {
  AppraisalsRightsActionTypes,
  AppraisalsRightsActionsUnion
} from '../actions/rights.actions';

// interfaces
import { AppraisalRights } from '../effects/rights.effects';

// compose reducer state shape here
export interface RightsState {
  position: AppraisalRights;
}

// compose initial state here
export const initialState = {
  position: null
};

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: AppraisalsRightsActionsUnion
): RightsState {
  switch (action.type) {
    case AppraisalsRightsActionTypes.CHECK_RIGHTS_SUCCESS: {
      return { ...state, position: action.rights };
    }

    default:
      return state;
  }
}

export const getAppraisalPositionsCheck = (state: RightsState) =>
  state.position;
