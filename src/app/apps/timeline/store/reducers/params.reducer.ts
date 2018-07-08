// actions
import {
  ParamsActionTypes,
  ParamsActionsUnion
} from '../actions/params.actions';

// constants
import { WirelinePath, ApiPath } from '../../../../shared/constants';

export interface ParamsState {
  locations: number[];
  query: string;
  top: number;
}

export const initialState: ParamsState = {
  locations: null,
  query: null,
  top: null
};

export function reducer(
  state = initialState,
  action: ParamsActionsUnion
): ParamsState {
  switch (action.type) {
    case ParamsActionTypes.UPDATE_PARAMS:
      return {
        ...state,
        ...action.params
      };

    default:
      return state;
  }
}

export const getParams = (state: ParamsState) => state;
