import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPeoplePositions from '../reducers/people-positions.reducer';

// select sub-feature state
export const getPeoplePositionsState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.peoplePositions
);

// selectors

export const getPeoplePositionsSearching = createSelector(
  getPeoplePositionsState,
  fromPeoplePositions.getPeoplePositionsSearching
);

export const selectAllPeoplePositions = createSelector(
  getPeoplePositionsState,
  fromPeoplePositions.selectAllPeoplePositions
);

export const selectPeoplePositionsTotal = createSelector(
  getPeoplePositionsState,
  fromPeoplePositions.selectPeoplePositionsTotal
);
