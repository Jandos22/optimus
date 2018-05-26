import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromPpeCatalog from './ppe-catalog.reducer';

export interface PpeState {
  catalog: fromPpeCatalog.PpeCatalogState;
}

export const reducers: ActionReducerMap<PpeState> = {
  catalog: fromPpeCatalog.reducer
};

export const getPpeState = createFeatureSelector<PpeState>('ppe');
