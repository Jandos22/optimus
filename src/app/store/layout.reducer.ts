import { WindowProperties } from '../shared/interfaces/window-properties.model';
import { SidenavProperties } from '../shared/interfaces/sidenav-properties.model';

import * as layout from './layout.actions';

export interface LayoutState {
    window: WindowProperties;
    sidenav: SidenavProperties;
}

const initialState: LayoutState = {
    window: {
        isXS: false,
        isS800: false,
        isS: false,
        isM: false,
        isL: false,
        isXL: false,
    },
    sidenav: {
        opened: false,
        mode: 'over',
        lockedinclosed: false
    },
};

export function reducer(state = initialState, action: layout.Actions): LayoutState {

    let show: boolean;
    let locked: boolean;

    switch (action.type) {

        case layout.UPDATE_LAYOUT:
            return {
                ...state,
                window: {
                    ...state.window,
                    ...action.window
                },
                sidenav: {
                    ...state.sidenav,
                    ...action.sidenav
                }
            };

        case layout.TOGGLE_SIDENAV:
            show = !state.sidenav.opened;
            state.sidenav.opened === true ? locked = true : locked = false;
            return {
                ...state,
                sidenav: {
                    ...state.sidenav,
                    opened: show,
                    lockedinclosed: locked
                }
            };

        case layout.CLOSE_SIDENAV:
            return {
                ...state, sidenav: {...state.sidenav, opened: false}
            };

        case layout.CLICK_SIDENAV:
            state.sidenav.mode === 'over' ? show = false : show = true;
            return {
                ...state, sidenav: {...state.sidenav, opened: show}
            };

        default:
            return state;
    }
}

export const getWindowState = (state: LayoutState) => state.window;
export const getIsXS = (state: LayoutState) => state.window.isXS;

export const getSidenavState = (state: LayoutState) => state.sidenav;
export const getSidenavOpened = (state: LayoutState) => state.sidenav.opened;
export const getSidenavMode = (state: LayoutState) => state.sidenav.mode;
export const getLockedInClosed = (state: LayoutState) => state.sidenav.lockedinclosed;
