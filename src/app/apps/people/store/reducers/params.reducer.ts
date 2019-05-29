import * as fromParams from "../actions/params.action";

export interface ParamsState {
  text: string;
  locations: number[] | "Global";
  top: number;
  positions: number[];
  chooseFrom?: number[];
}

export const initialState: ParamsState = {
  text: null,
  locations: null,
  top: null,
  positions: null,
  chooseFrom: null
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
