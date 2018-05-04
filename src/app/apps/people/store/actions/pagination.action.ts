import { Action } from '@ngrx/store';

// interfaces
import { PaginationIndexes } from '../../models/pagination-indexes.model';

// actions
export const RESET_PAGINATION = '[People] R - Reset Pagination';
export const START_NEW_PAGE = '[People] R - Start New Page';
export const ADD_NEXT_LINK = '[People] R - Add Next Link';
export const NO_NEXT_LINK = '[People] R - No Next Link';

export const ON_NEXT = '[People] R/E - Next Button Clicked';
export const ON_BACK = '[People] R/E - Back Button Clicked';

// action creators

export class ResetPagination implements Action {
  readonly type = RESET_PAGINATION;
  constructor() {}
}

export class StartNewPage implements Action {
  readonly type = START_NEW_PAGE;
  constructor(public url: string) {}
}

export class AddNextLink implements Action {
  readonly type = ADD_NEXT_LINK;
  constructor(public url: string) {}
}

export class NoNextLink implements Action {
  readonly type = NO_NEXT_LINK;
}

export class OnNext implements Action {
  readonly type = ON_NEXT;
  constructor(public url: string) {}
}

export class OnBack implements Action {
  readonly type = ON_BACK;
  constructor(public url: string) {}
}

export type PaginationActions =
  | ResetPagination
  | StartNewPage
  | AddNextLink
  | NoNextLink
  | OnNext
  | OnBack;
