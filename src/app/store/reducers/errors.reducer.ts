import * as a_in_errors from '../actions/errors.actions';

export interface ErrorsState {
  errors_list: any[];
}

const initialState: ErrorsState = {
  errors_list: []
};

export function reducer(
  state = initialState,
  action: a_in_errors.Actions
): ErrorsState {
  switch (action.type) {
    case a_in_errors.ERROR:
      return {
        ...state,
        errors_list: [...state.errors_list, action.payload]
      };

    default:
      return state;
  }
}

// for selector functions

export const getErrorsList = (state: ErrorsState) => state.errors_list;
