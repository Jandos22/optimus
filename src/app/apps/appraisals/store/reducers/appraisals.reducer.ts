// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  AppraisalsActionTypes,
  AppraisalsActionsUnion
} from '../actions/appraisals.actions';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';

// compose reducer state shape here
export interface AppraisalsState extends EntityState<AppraisalItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<AppraisalItem> = createEntityAdapter<
  AppraisalItem
>({});

// compose initial state here
export const initialState: AppraisalsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: AppraisalsActionsUnion
): AppraisalsState {
  switch (action.type) {
    case AppraisalsActionTypes.SEARCH_APPRAISALS_START: {
      return { ...state, searching: true };
    }

    case AppraisalsActionTypes.SEARCH_APPRAISALS_SUCCESS: {
      const adapted = adapter.addAll(action.appraisals, state);
      return { ...adapted, searching: false };
    }

    case AppraisalsActionTypes.SEARCH_APPRAISALS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case AppraisalsActionTypes.INSERT_ONE_APPRAISAL: {
      const appraisal = action.appraisal;
      const ids = [appraisal.ID, ...state.ids] as string[] | number[];
      const entities = { [appraisal.ID]: appraisal, ...state.entities };
      return { ...state, ids, entities };
    }

    case AppraisalsActionTypes.ADD_ONE_APPRAISAL: {
      return adapter.addOne(action.appraisal, state);
    }

    case AppraisalsActionTypes.UPDATE_ONE_APPRAISAL: {
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
  selectIds: selectAppraisalsIds,
  selectEntities: selectAppraisalsEntities,
  selectAll: selectAllAppraisals,
  selectTotal: selectAppraisalsTotal
} = adapter.getSelectors();

export const getAppraisalsSearching = (state: AppraisalsState) =>
  state.searching;
