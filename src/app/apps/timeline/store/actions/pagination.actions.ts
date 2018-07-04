import { Action } from '@ngrx/store';

// actions
export enum PaginationActionTypes {
  // below actions caught only in reducers
  RESET_PAGINATION = '[Timeline Pagination] Reset (since params changed)',
  // START_NEW_PAGE = '[People] R - Start New Page',

  UPDATE_TOTAL_DISPLAYED = '[Timeline Pagination] Update Total Displayed',
  UPDATE_TOTAL_EXIST = '[Timeline Pagination] Update Total Exist',

  ADD_LINK = '[Timeline Pagination] Add Link',
  REMOVE_LINK = '[Timeline Pagination] Remove Link',

  // below actions have side effects
  ON_NEXT = '[Timeline] Next Button Clicked',
  ON_BACK = '[Timeline] Back Button Clicked'
}

// action creators

export class ResetPagination implements Action {
  readonly type = PaginationActionTypes.RESET_PAGINATION;
  constructor() {}
}

export class UpdateTotalDisplayed implements Action {
  readonly type = PaginationActionTypes.UPDATE_TOTAL_DISPLAYED;
  constructor(public totalDisplayed: number) {}
}

export class UpdateTotalExist implements Action {
  readonly type = PaginationActionTypes.UPDATE_TOTAL_EXIST;
  constructor(public totalExist: number) {}
}

export class AddLink implements Action {
  readonly type = PaginationActionTypes.ADD_LINK;
  constructor(public url: string) {}
}

export class RemoveLink implements Action {
  readonly type = PaginationActionTypes.REMOVE_LINK;
  constructor(public index: number) {}
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
  // | StartNewPage
  | UpdateTotalDisplayed
  | UpdateTotalExist
  | AddLink
  | RemoveLink
  | OnNext
  | OnBack;
