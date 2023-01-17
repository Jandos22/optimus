// actions
import {
  ParamsActionTypes,
  ParamsActionsUnion
} from "../actions/params.actions";

export interface ParamsState {
  text: string;
  status: string;
  locations: number[];
  top: number;
}

export const initialState: ParamsState = {
  text: null,
  status: null,
  locations: null,
  top: 100
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
