// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  ToolNamesActionTypes,
  ToolNamesActionsUnion
} from '../actions/tool-names.actions';

// interfaces
import { ToolItem } from '../../../../shared/interface/tools.model';

// compose reducer state shape here
export interface ToolNamesState extends EntityState<ToolItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<ToolItem> = createEntityAdapter<ToolItem>(
  {}
);

// compose initial state here
export const initialState: ToolNamesState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: ToolNamesActionsUnion
): ToolNamesState {
  switch (action.type) {
    case ToolNamesActionTypes.FETCH_TOOL_NAMES: {
      return { ...state, searching: true };
    }

    case ToolNamesActionTypes.FETCH_TOOL_NAMES_SUCCESS: {
      const adapted = adapter.addAll(action.toolsNames, state);
      return { ...adapted, searching: false };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectToolNamesIds,
  selectEntities: selectToolNamesEntities,
  selectAll: selectAllToolNames,
  selectTotal: selectToolNamesTotal
} = adapter.getSelectors();

export const getToolNamesSearching = (state: ToolNamesState) => state.searching;
