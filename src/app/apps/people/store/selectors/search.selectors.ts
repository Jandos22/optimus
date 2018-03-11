import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSearch from '../reducers/search.reducer';

// select feature state
export const getSearchState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.search
);

// selectors

export const getSearch = createSelector(getSearchState, fromSearch.getSearch);

export const getSearchParams = createSelector(
  getSearchState,
  fromSearch.getSearchParams
);

export const getSearchQuery = createSelector(
  getSearchState,
  fromSearch.getSearchQuery
);

export const getSearchLocation = createSelector(
  getSearchState,
  fromSearch.getSearchLocation
);

export const getSearchUriCurrent = createSelector(
  getSearchState,
  fromSearch.getSearchUriCurrent
);
