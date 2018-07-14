// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  ProjectTypesActionTypes,
  ProjectTypesActionsUnion
} from '../actions/project-types.actions';

// interfaces
import { KaizenProjectType } from '../../../../shared/interface/kaizen.model';

// compose reducer state shape here
export interface ProjectTypesState extends EntityState<KaizenProjectType> {
  applicable: KaizenProjectType[];
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<KaizenProjectType> = createEntityAdapter<
  KaizenProjectType
>({});

// compose initial state here
export const initialState: ProjectTypesState = adapter.getInitialState({
  applicable: [],
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: ProjectTypesActionsUnion
): ProjectTypesState {
  switch (action.type) {
    case ProjectTypesActionTypes.FETCH_PROJECT_TYPES: {
      return { ...state, searching: true };
    }

    case ProjectTypesActionTypes.FETCH_PROJECT_TYPES_SUCCESS: {
      const adapted = adapter.addAll(action.projectTypes, state);
      return { ...adapted, searching: false };
    }

    case ProjectTypesActionTypes.FILTERING_APPLICABLE_PROJECT_TYPES_SUCCESS: {
      return { ...state, applicable: action.applicableProjectTypes };
    }

    default:
      return state;
  }
}

// default adapter selectors aimed to reduce boilerplate
export const {
  selectIds: selectProjectTypesIds,
  selectEntities: selectProjectTypesEntities,
  selectAll: selectAllProjectTypes,
  selectTotal: selectProjectTypesTotal
} = adapter.getSelectors();

export const getProjectTypesSearching = (state: ProjectTypesState) =>
  state.searching;
export const getApplicableProjectTypes = (state: ProjectTypesState) =>
  state.applicable;
