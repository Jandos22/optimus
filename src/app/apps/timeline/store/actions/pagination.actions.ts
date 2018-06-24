import { Action } from '@ngrx/store';

// actions
export enum PaginationActionTypes {
  // below actions caught only in reducers
  RESET_PAGINATION = '[Timeline] Reset Pagination',
  START_NEW_PAGE = '[Timeline] Start New Page',
  ADD_NEXT_LINK = '[Timeline] Add Next Link',
  NO_NEXT_LINK = '[Timeline] No Next Link',
  // below actions have side effects
  ON_NEXT = '[Timeline] Next Button Clicked',
  ON_BACK = '[Timeline] Back Button Clicked'
}

// action creators

export class ResetPagination implements Action {
  readonly type = PaginationActionTypes.RESET_PAGINATION;
  constructor() {}
}

export class StartNewPage implements Action {
  readonly type = PaginationActionTypes.START_NEW_PAGE;
  constructor(public url: string) {}
}

export class AddNextLink implements Action {
  readonly type = PaginationActionTypes.ADD_NEXT_LINK;
  constructor(public url: string) {}
}

export class NoNextLink implements Action {
  readonly type = PaginationActionTypes.NO_NEXT_LINK;
}

export class OnNext implements Action {
  readonly type = PaginationActionTypes.ON_NEXT;
  constructor(public url: string) {}
}

export class OnBack implements Action {
  readonly type = PaginationActionTypes.ON_BACK;
  constructor(public url: string) {}
}

export type PaginationActionsUnion =
  | ResetPagination
  | StartNewPage
  | AddNextLink
  | NoNextLink
  | OnNext
  | OnBack;
