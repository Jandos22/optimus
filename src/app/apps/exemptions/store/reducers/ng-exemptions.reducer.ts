import {
  ExemptionsActionTypes,
  ExemptionsActionsUnion
} from './../actions/exemptions.actions';

export interface ExemptionsState {
  list: any[];
}

export const initialState: ExemptionsState = {
  list: ['Exemption1', 'Exemption2']
};

export function reducer(
  state = initialState,
  action: ExemptionsActionsUnion
): ExemptionsState {
  switch (action.type) {
    // update list of exemptions
    case ExemptionsActionTypes.UPDATE_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }

    default:
      return state;
  }
}

export const getExemptionsList = (state: ExemptionsState) => state.list;
