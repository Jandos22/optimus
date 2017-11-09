import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer
} from '@ngrx/store';

import { environment } from '../../environments/environment';
import { RouterStateUrl } from '../store/router.utilities';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromRouter from '@ngrx/router-store';
import * as fromLayout from '../store/layout.reducer';
import * as fromApplication from '../store/application.reducer';

export interface State {
    application: fromApplication.ApplicationState;
    layout: fromLayout.LayoutState;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
    application: fromApplication.reducer,
    layout: fromLayout.reducer,
    routerReducer: fromRouter.routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[]
    = !environment.production ? [logger, storeFreeze] : [];

// Layout Reducer Selectors
export const getLayoutState = createFeatureSelector<fromLayout.LayoutState>('layout');

export const getSidenavState
    = createSelector(getLayoutState, fromLayout.getSidenavState);

export const getSidenavMode
    = createSelector(getLayoutState, fromLayout.getSidenavMode);

export const getSidenavAutoCollapseWidth
    = createSelector(getLayoutState, fromLayout.getSidenavAutoCollapseWidth);

export const getSidenavBackDrop
    = createSelector(getLayoutState, fromLayout.getSidenavBackDrop);

export const getSidenavCloseOnBackDrop
    = createSelector(getLayoutState, fromLayout.getSidenavCloseOnBackDrop);

// Layout Reducer Selectors
export const getApplicationState = createFeatureSelector<fromApplication.ApplicationState>('application');

export const getApplicationLocations
    = createSelector(getApplicationState, fromApplication.getApplicationLocations);
