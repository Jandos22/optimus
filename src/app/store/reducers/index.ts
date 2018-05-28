import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router';

import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import * as fromApplication from './application.reducer';
import * as fromLayout from './layout.reducer';
import * as fromUser from './user.reducer';

// models
import { UserState } from './../../ngrx-state-models/user-state.model';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface RouterState {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export interface RootState {
  application: fromApplication.ApplicationState;
  user: UserState;
  layout: fromLayout.LayoutState;
}

export const reducers: ActionReducerMap<RouterState> = {
  routerReducer: fromRouter.routerReducer
};

export const root: ActionReducerMap<RootState> = {
  application: fromApplication.reducer,
  user: fromUser.reducer,
  layout: fromLayout.reducer
};

// feature selectors
export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

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
