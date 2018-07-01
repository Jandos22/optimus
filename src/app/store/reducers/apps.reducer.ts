// actions
import { AppsActionTypes, AppsActionsUnion } from '../actions/apps.actions';

// ngrx
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// interfaces
import { AppItem } from '../../shared/interface/applications.model';

// root.apps state
export interface AppsState extends EntityState<AppItem> {
  name: string;
}

// entity adapter
export const adapter: EntityAdapter<AppItem> = createEntityAdapter<AppItem>();

// initial state
export const initialState: AppsState = adapter.getInitialState({
  name: null
});

// reducer function
export function reducer(
  state = initialState,
  action: AppsActionsUnion
): AppsState {
  switch (action.type) {
    case AppsActionTypes.SET_APP_NAME:
      return {
        ...state,
        name: action.payload
      };

    case AppsActionTypes.GET_ALL_APPS_SUCCESS:
      return adapter.addAll(action.apps, state);

    default:
      return state;
  }
}

// selectors

export const {
  selectIds: selectAppsIds,
  selectEntities: selectAppsEntities,
  selectAll: selectAllApps,
  selectTotal: selectAppsTotal
} = adapter.getSelectors();

export const getAppName = (state: AppsState) => state.name;
