// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  ExemptionsActionTypes,
  ExemptionsActionsUnion
} from '../actions/exemptions.actions';

// interfaces
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

// compose reducer state shape here
export interface ExemptionsState extends EntityState<ExemptionItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<ExemptionItem> = createEntityAdapter<
  ExemptionItem
>({});

// compose initial state here
export const initialState: ExemptionsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: ExemptionsActionsUnion
): ExemptionsState {
  switch (action.type) {
    case ExemptionsActionTypes.SEARCH_EXEMPTIONS_START: {
      return { ...state, searching: true };
    }

    case ExemptionsActionTypes.SEARCH_EXEMPTIONS_SUCCESS: {
      const adapted = adapter.addAll(action.exemptions, state);
      return { ...adapted, searching: false };
    }

    case ExemptionsActionTypes.SEARCH_EXEMPTIONS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case ExemptionsActionTypes.INSERT_ONE_EXEMPTION: {
      const exemption = action.exemption;
      const ids = [exemption.ID, ...state.ids] as string[] | number[];
      const entities = { [exemption.ID]: exemption, ...state.entities };
      return { ...state, ids, entities };
    }

    case ExemptionsActionTypes.ADD_ONE_EXEMPTION: {
      return adapter.addOne(action.exemption, state);
    }

    case ExemptionsActionTypes.UPDATE_ONE_EXEMPTION: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectExemptionsIds,
  selectEntities: selectExemptionsEntities,
  selectAll: selectAllExemptions,
  selectTotal: selectExemptionsTotal
} = adapter.getSelectors();

export const getExemptionsSearching = (state: ExemptionsState) =>
  state.searching;
