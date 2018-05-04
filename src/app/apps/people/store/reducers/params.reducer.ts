import * as fromParams from '../actions/params.action';

// constants
import { WirelinePath, ApiPath } from './../../../../constants/index';

export interface ParamsState {
  location: string;
  query: string;
  top: number;
}

export const initialState: ParamsState = {
  location: null,
  query: null,
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
