import { Action } from '@ngrx/store';

// interfaces
import { UserSearchParams } from '../../../../shared/interface/people.model';

// actions
export const BEGIN_SEARCH = '[People] E/R - Begin Search';
export const BEGIN_COUNT = '[People] E/R - Begin Count';

// action creators

export class BeginSearch implements Action {
  readonly type = BEGIN_SEARCH;
  constructor(public url: string) {}
}

export class BeginCount implements Action {
  readonly type = BEGIN_COUNT;
  constructor(public params: UserSearchParams) {}
}

export type SearchActions = BeginSearch | BeginCount;
