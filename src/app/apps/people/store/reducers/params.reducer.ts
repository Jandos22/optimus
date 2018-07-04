import * as fromParams from '../actions/params.action';

export interface ParamsState {
  query: string;
  locations: number[];
  top: number;
}

export const initialState: ParamsState = {
  query: null,
  locations: null,
  top: null
};

export function reducer(
  state = initialState,
  action: fromParams.ParamsActions
): ParamsState {
  switch (action.type) {
    case fromParams.UPDATE_PARAMS:
      return {
        ...state,
        ...action.params
      };

    default:
      return state;
  }
}

export const getParams = (state: ParamsState) => state;
