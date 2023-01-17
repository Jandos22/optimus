import { Action } from '@ngrx/store';

// actions
export enum PaginationActionTypes {
  // below actions caught only in reducers
  RESET_PAGINATION = '[Batteries Pagination] Reset (since params changed)',  
  COUNT_TOTAL = "[Batteries Pagination] Count Total (since next url is present)",

  UPDATE_CURRENT_DISPLAYED = '[Batteries Pagination] Update Current Displayed',
  UPDATE_TOTAL_EXIST = '[Batteries Pagination] Update Total Exist',

  ADD_LINK = '[Batteries Pagination] Add Link',
  REMOVE_LINK = '[Batteries Pagination] Remove Link',

  // below actions have side effects
  ON_NEXT = '[Batteries] Next Button Clicked',
  ON_BACK = '[Batteries] Back Button Clicked'
}

// action creators

export class ResetPagination implements Action {
  readonly type = PaginationActionTypes.RESET_PAGINATION;
  constructor() {}
}

export class CountTotal implements Action {
  readonly type = PaginationActionTypes.COUNT_TOTAL;
}

export class UpdateCurrentDisplayed implements Action {
  readonly type = PaginationActionTypes.UPDATE_CURRENT_DISPLAYED;
  constructor(public currentDisplayed: number) {}
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
  | CountTotal
  | UpdateCurrentDisplayed
  | UpdateTotalExist
  | AddLink
  | RemoveLink
  | OnNext
  | OnBack;
