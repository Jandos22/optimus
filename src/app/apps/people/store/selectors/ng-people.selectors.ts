import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromNgPeople from '../reducers/ng-people.reducer';

// select feature state
export const getNgPeopleState = createSelector(
  fromFeature.getPeopleState,
  (state: fromFeature.PeopleState) => state.NgPeople
);

// selectors

export const getPeopleList = createSelector(
  getNgPeopleState,
  fromNgPeople.getNgPeopleList
);

export const getPeopleTotal = createSelector(
  getNgPeopleState,
  fromNgPeople.getNgPeopleTotal
);
