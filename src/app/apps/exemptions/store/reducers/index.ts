import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromExemptions from './ng-exemptions.reducer';

export interface ExemptionsState {
  NgExemptions: fromExemptions.ExemptionsState;
}

export const reducers: ActionReducerMap<ExemptionsState> = {
  NgExemptions: fromExemptions.reducer
};

export const getExemptionsState = createFeatureSelector<ExemptionsState>(
  'exemptions'
);
