// actions
import { PpeActionTypes, PpeActionsUnion } from '../actions/ppe.actions';

// interfaces
import {
  PpeCategory,
  PpeItemsByCategory
} from '../../../../shared/interface/ppe.model';
import { PpeItem } from '../../../../shared/interface/ppe.model';

export interface PpeCatalogState {
  categories: PpeCategory[];
  items: PpeItem[];
  items_by_category: PpeItemsByCategory[];
}

export const initialState: PpeCatalogState = {
  categories: [],
  items: [],
  items_by_category: []
};

export function reducer(
  state = initialState,
  action: PpeActionsUnion
): PpeCatalogState {
  switch (action.type) {
    case PpeActionTypes.WRITE_PPE_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case PpeActionTypes.WRITE_PPE_ITEMS:
      return {
        ...state,
        items: action.payload
      };

    case PpeActionTypes.WRITE_GROUPED_PPE_ITEMS:
      return {
        ...state,
        items_by_category: action.payload
      };

    default:
      return state;
  }
}

export const getPpeCategories = (state: PpeCatalogState) => state.categories;
export const getPpeItems = (state: PpeCatalogState) => state.items;
export const getPpeItemsByCategory = (state: PpeCatalogState) =>
  state.items_by_category;
