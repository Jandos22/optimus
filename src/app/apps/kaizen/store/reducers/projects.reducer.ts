// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// actions
import {
  ProjectsActionTypes,
  ProjectsActionsUnion
} from '../actions/projects.actions';

// interfaces
import { KaizenProjectItem } from '../../../../shared/interface/kaizen.model';

// compose reducer state shape here
export interface ProjectsState extends EntityState<KaizenProjectItem> {
  searching: boolean;
}

// entity adapter
export const adapter: EntityAdapter<KaizenProjectItem> = createEntityAdapter<
  KaizenProjectItem
>({});

// compose initial state here
export const initialState: ProjectsState = adapter.getInitialState({
  searching: false
});

// actions get caught and they update state
export function reducer(
  state = initialState,
  action: ProjectsActionsUnion
): ProjectsState {
  switch (action.type) {
    case ProjectsActionTypes.SEARCH_PROJECTS_START: {
      return { ...state, searching: true };
    }

    case ProjectsActionTypes.SEARCH_PROJECTS_SUCCESS: {
      const adapted = adapter.addAll(action.projects, state);
      return { ...adapted, searching: false };
    }

    case ProjectsActionTypes.SEARCH_PROJECTS_NO_RESULTS: {
      const adapted = adapter.removeAll(state);
      return { ...adapted, searching: false };
    }

    case ProjectsActionTypes.INSERT_ONE_PROJECT: {
      const project = action.project;
      const ids = [project.ID, ...state.ids] as string[] | number[];
      const entities = { [project.ID]: project, ...state.entities };
      return { ...state, ids, entities };
    }

    case ProjectsActionTypes.ADD_ONE_PROJECT: {
      return adapter.addOne(action.project, state);
    }

    case ProjectsActionTypes.UPDATE_ONE_PROJECT: {
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
  selectIds: selectProjectsIds,
  selectEntities: selectProjectsEntities,
  selectAll: selectAllProjects,
  selectTotal: selectProjectsTotal
} = adapter.getSelectors();

export const getProjectsSearching = (state: ProjectsState) => state.searching;
