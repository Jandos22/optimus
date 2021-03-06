// actions
import {
  ParamsActionTypes,
  ParamsActionsUnion
} from "../actions/params.actions";

// constants
import { WirelinePath, ApiPath } from "../../../../shared/constants";

export interface ParamsState {
  text: string;
  locations: number[];
  top: number;
  afterDate?: Date;
  beforeDate?: Date;
  givenfor: number;
  givenby: number;
  chooseFrom?: number[];
}

export const initialState: ParamsState = {
  text: null,
  locations: null,
  top: null,
  afterDate: null,
  beforeDate: null,
  givenfor: null,
  givenby: null,
  chooseFrom: null
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
