import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router';

import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';

import * as fromApp from './app.reducer';
import * as fromLayout from './layout.reducer';
import * as fromUser from './user.reducer';
import * as fromErrors from './errors.reducer';
import * as fromLocations from './locations.reducer';

// models
import { UserState } from '../../shared/interface/user.model';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface RouterState {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export interface RootState {
  app: fromApp.AppState;
  user: UserState;
  layout: fromLayout.LayoutState;
  errors: fromErrors.ErrorsState;
  locations: fromLocations.State;
}

export const reducers: ActionReducerMap<RouterState> = {
  routerReducer: fromRouter.routerReducer
};

export const root: ActionReducerMap<RootState> = {
  app: fromApp.reducer,
  user: fromUser.reducer,
  layout: fromLayout.reducer,
  errors: fromErrors.reducer,
  locations: fromLocations.reducer
};

// feature selectors
export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

export const getRouterUrl = createSelector(
  getRouterState,
  state => state.state.url
);

export const getRootState = createFeatureSelector<RootState>('root');

// custom router serializer
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
