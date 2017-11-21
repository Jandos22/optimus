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
import * as fromUser from '../store/user.reducer';

export interface State {
    application: fromApplication.ApplicationState;
    user: fromUser.UserState;
    layout: fromLayout.LayoutState;
    routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
    application: fromApplication.reducer,
    user: fromUser.reducer,
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

// LAYOUT Selectors
export const getLayoutState = createFeatureSelector<fromLayout.LayoutState>('layout');

    export const getWindowState
    = createSelector(getLayoutState, fromLayout.getWindowState);

    export const getSidenavState
    = createSelector(getLayoutState, fromLayout.getSidenavState);

    export const getSidenavOpened
    = createSelector(getLayoutState, fromLayout.getSidenavOpened);

    export const getSidenavMode
    = createSelector(getLayoutState, fromLayout.getSidenavMode);

    export const getLockedInClosed
    = createSelector(getLayoutState, fromLayout.getLockedInClosed);

// APPLICATION Selectors
export const getApplicationState = createFeatureSelector<fromApplication.ApplicationState>('application');

    export const getApplicationName
    = createSelector(getApplicationState, fromApplication.getApplicationName);

    export const getApplicationLocations
    = createSelector(getApplicationState, fromApplication.getApplicationLocations);

    export const getApplicationLocation
    = createSelector(getApplicationState, fromApplication.getApplicationLocation);

// USER Selectors
export const getUserState = createFeatureSelector<fromUser.UserState>('user');

    export const getIsRegistered
    = createSelector(getUserState, fromUser.getIsRegistered);

    export const getInitials
    = createSelector(getUserState, fromUser.getInitials);

    export const getPhoto
    = createSelector(getUserState, fromUser.getPhoto);
