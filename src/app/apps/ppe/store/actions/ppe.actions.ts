import { Action } from '@ngrx/store';

// interface
import { PpeCategory, PpeItem } from '../../../../shared/interface/ppe.model';

export enum PpeActionTypes {
  GET_PPE_CATALOG = '[PPE] Get PPE Catalog',
  GET_PPE_CATEGORIES = '[PPE] Get Categories',
  GET_PPE_ITEMS = '[PPE] Get Items',
  GET_PPE_ITEMS_ATTACHMENTS = '[PPE] Get Items Attachments',
  WRITE_PPE_CATEGORIES = '[PPE] Write Categories',
  WRITE_PPE_ITEMS = '[PPE] Write Items',
  WRITE_GROUPED_PPE_ITEMS = '[PPE] Write Grouped PPE Items',
  GROUP_ITEMS_BY_CATEGORY = '[PPE] Group Items By Categories'
}

export class GetPpeCatalog implements Action {
  readonly type = PpeActionTypes.GET_PPE_CATALOG;
}

export class GetPpeCategories implements Action {
  readonly type = PpeActionTypes.GET_PPE_CATEGORIES;
}

export class GetPpeItems implements Action {
  readonly type = PpeActionTypes.GET_PPE_ITEMS;
}

export class GetPpeItemsAttachments implements Action {
  readonly type = PpeActionTypes.GET_PPE_ITEMS_ATTACHMENTS;
  constructor(public payload: any) {}
}

export class WritePpeItems implements Action {
  readonly type = PpeActionTypes.WRITE_PPE_ITEMS;
  constructor(public payload: any) {}
}

export class WritePpeCategories implements Action {
  readonly type = PpeActionTypes.WRITE_PPE_CATEGORIES;
  constructor(public payload: any) {}
}

export class WriteGroupedPpeItems implements Action {
  readonly type = PpeActionTypes.WRITE_GROUPED_PPE_ITEMS;
  constructor(public payload: any) {}
}

export class GroupItemsByCategory implements Action {
  readonly type = PpeActionTypes.GROUP_ITEMS_BY_CATEGORY;
  constructor(public payload: any) {}
}

export type PpeActionsUnion =
  | GetPpeCatalog
  | GetPpeCategories
  | GetPpeItems
  | GetPpeItemsAttachments
  | GroupItemsByCategory
  | WritePpeCategories
  | WritePpeItems
  | WriteGroupedPpeItems;
