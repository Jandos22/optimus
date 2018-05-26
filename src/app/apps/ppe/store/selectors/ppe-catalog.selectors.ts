import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPpeCatalog from '../reducers/ppe-catalog.reducer';

// select feature/reducer state
export const getPpeCatalogState = createSelector(
  fromFeature.getPpeState,
  (state: fromFeature.PpeState) => {
    console.log(state);
    return state.catalog;
  }
);

// selectors

export const getPpeCategories = createSelector(
  getPpeCatalogState,
  fromPpeCatalog.getPpeCategories
);

export const getPpeItems = createSelector(
  getPpeCatalogState,
  fromPpeCatalog.getPpeItems
);

export const getPpeItemsByCategory = createSelector(
  getPpeCatalogState,
  fromPpeCatalog.getPpeItemsByCategory
);
