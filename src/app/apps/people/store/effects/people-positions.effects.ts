import { Injectable } from '@angular/core';

// rxjs
import { of } from 'rxjs';

import {
  map,
  switchMap,
  mergeMap,
  catchError,
  withLatestFrom,
  skipUntil,
  skipWhile,
  skip
} from 'rxjs/operators';

// lodash
import * as _ from 'lodash';

// ngrx
import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromRoot from '../../../../store';
import * as fromPeople from '..';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { PeoplePositionsService } from './../../services/people-positions.service';

// interfaces
import { UserPosition } from '../../../../shared/interface/people.model';

@Injectable()
export class PeoplePositionsEffects {
  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: PeoplePositionsService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchPeoplePositions$ = this.actions$.pipe(
    ofType(fromPeople.PeoplePositionsActionTypes.FETCH_PEOPLE_POSITIONS),
    switchMap(x => {
      return this.srv.getUserPositions().pipe(
        map(peoplePositions => {
          return _.sortBy(peoplePositions, (position: UserPosition) => {
            return position.AccessLevel;
          });
        }),
        map(peoplePositions => {
          peoplePositions = _.map(
            peoplePositions,
            (userPosition: UserPosition) => {
              return { ...userPosition, id: userPosition.ID };
            }
          );

          return new fromPeople.FetchPeoplePositionsSuccess(peoplePositions);
        }),
        catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
  );
}
