import { Action } from '@ngrx/store';

// actions
export enum PaginationActionTypes {
  // below actions caught only in reducers
  RESET_PAGINATION = '[Appraisals Pagination] Reset (since params changed)',

  UPDATE_TOTAL_DISPLAYED = '[Appraisals Pagination] Update Total Displayed',
  UPDATE_TOTAL_EXIST = '[Appraisals Pagination] Update Total Exist',

  ADD_LINK = '[Appraisals Pagination] Add Link',
  REMOVE_LINK = '[Appraisals Pagination] Remove Link',

  // below actions have side effects
  ON_NEXT = '[Appraisals] Next Button Clicked',
  ON_BACK = '[Appraisals] Back Button Clicked'
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
  | UpdateTotalDisplayed
  | UpdateTotalExist
  | AddLink
  | RemoveLink
  | OnNext
  | OnBack;
