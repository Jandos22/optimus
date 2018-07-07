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
import * as fromTimeline from '../index';
import * as fromErrorActions from '../../../../store/actions/errors.actions';

// services
import { TimelineTypeService } from '../../services/timeline-type.service';

// interfaces
import {
  TimelineEventItem,
  TimelineSearchParams,
  TimelineEventType
} from '../../../../shared/interface/timeline.model';

@Injectable()
export class EventTypesEffects {

  constructor(
    private store$: Store<fromRoot.RootState>,
    private actions$: Actions,
    private srv: TimelineTypeService
  ) {}

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchEventTypes$ = this.actions$.pipe(
    ofType(fromTimeline.EventTypesActionTypes.FETCH_EVENT_TYPES),
    switchMap(x => {
      return this.srv.getEventTypes().pipe(
          map(eventTypes => {

            eventTypes = _.map(eventTypes, (eventType: TimelineEventType) => {
              return { ...eventType, id: eventType.ID };
            });

            return new fromTimeline.FetchEventTypesSuccess(eventTypes);
          }),
          catchError(error => of(new fromErrorActions.DisplayError(error)))
      );
    })
    );

  // when params change:
  // reset pagination and get new url
  @Effect()
  fetchEventTypesSuccess$ = this.actions$.pipe(
    ofType(fromTimeline.EventTypesActionTypes.FETCH_EVENT_TYPES_SUCCESS),
    withLatestFrom(this.store$.pipe(
      select(fromRoot.getUserLocationAssignedId))),
    map((merged: any[]) => {
      return {
        action: merged[0] as fromTimeline.FetchEventTypesSuccess,
        locationAssignedId: merged[1] as number
      };
    }),
    map(merged => {

      // this location assigned id of current user
      const id = merged.locationAssignedId;

      // start filtering for applicable event types
      //  iterate over ApplicableTo array and look
      // if its ID is equal to locationAssignedId
      const applicableTo = merged.action.eventTypes.filter(
        eventType => {
          const byLocationAssigned = _.find(eventType.ApplicableTo, { ID: id }) ? true : false;
          const byLocationGlobal = _.find(eventType.ApplicableTo, { Title: 'Global' }) ? true : false;
          return byLocationAssigned || byLocationGlobal ? true : false;
        }
      );

      console.log(applicableTo);

      return new fromTimeline.FilteringApplicableEventTypesSuccess(applicableTo);
    })
    );

  mapIds(eventType: TimelineEventType) {
    return { ...eventType, id: eventType.ID };
  }
}
