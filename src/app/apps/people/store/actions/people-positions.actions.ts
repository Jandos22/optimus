import { Action } from '@ngrx/store';

import { UserPosition } from '../../../../shared/interface/people.model';

export enum PeoplePositionsActionTypes {
  FETCH_PEOPLE_POSITIONS = '[People] Fetch People Positions',
  FETCH_PEOPLE_POSITIONS_SUCCESS = '[People] Fetch People Positions Success'
}

export class FetchPeoplePositions implements Action {
  readonly type = PeoplePositionsActionTypes.FETCH_PEOPLE_POSITIONS;
}

export class FetchPeoplePositionsSuccess implements Action {
  readonly type = PeoplePositionsActionTypes.FETCH_PEOPLE_POSITIONS_SUCCESS;
  constructor(public peoplePositions: UserPosition[]) {}
}

export type PeoplePositionsActionsUnion =
  | FetchPeoplePositions
  | FetchPeoplePositionsSuccess;
