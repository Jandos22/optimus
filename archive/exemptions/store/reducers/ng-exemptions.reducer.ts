import {
  ExemptionsActionTypes,
  ExemptionsActionsUnion
} from '../actions/exemptions.actions';

export interface ExemptionsState {
  list: any[];
  groups: any[];
}

export const initialState: ExemptionsState = {
  list: [],
  groups: []
};

export function reducer(
  state = initialState,
  action: ExemptionsActionsUnion
): ExemptionsState {
  switch (action.type) {
    // update list of exemptions
    case ExemptionsActionTypes.UPDATE_EXEMPTIONS_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }
    // update list of exemptions
    case ExemptionsActionTypes.UPDATE_GROUPED_EXEMPTIONS_LIST: {
      return {
        ...state,
        groups: action.payload
      };
    }

    default:
      return state;
  }
}

export const getExemptionsList = (state: ExemptionsState) => state.list;
export const getGroupedExemptionsList = (state: ExemptionsState) =>
  state.groups;
