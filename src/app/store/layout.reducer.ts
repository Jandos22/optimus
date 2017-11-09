import { WindowProperties } from '../shared/interfaces/window-properties.model';
import { SidenavProperties } from '../shared/interfaces/sidenav-properties.model';

import * as layout from './layout.actions';

export interface LayoutState {
    window: WindowProperties;
    sidenav: SidenavProperties;
}

const initialState: LayoutState = {
    window: {
        innerWidth: null,
        innerHeight: null,
    },
    sidenav: {
        show: false,
        mode: 'push',
        autoCollapseWidth: 760,
        backDrop: true,
        closeOnClickBackDrop: true,
    },
};

export function reducer(state = initialState, action: layout.Actions): LayoutState {

    let show: boolean;
    let mode: string;
    let backDrop: boolean;

    switch (action.type) {

        case layout.INIT_LAYOUT:
        const a = action.payload.innerWidth;
        const b = state.sidenav.autoCollapseWidth;

        a <= b ? mode = 'over' : mode = 'push';
        mode === 'over' ? backDrop = true : backDrop = false;
        mode === 'push' ? show = true : show = false;

        return {
            ...state,
            window: {
                ...state.window,
                innerWidth: action.payload.innerWidth,
                innerHeight: action.payload.innerHeight,
            },
            sidenav: {
                ...state.sidenav,
                show: show,
                mode: mode,
                backDrop: backDrop,
            }
        };

        case layout.TOGGLE_SIDENAV:
            show = !state.sidenav.show;
            return {
                ...state, sidenav: {...state.sidenav, show: show}
            };

        case layout.CLOSE_SIDENAV:
            return {
                ...state, sidenav: {...state.sidenav, show: false}
            };

        case layout.CLICK_SIDENAV:
            state.sidenav.mode === 'over' ? show = false : show = true;
            return {
                ...state, sidenav: {...state.sidenav, show: show}
            };

        default:
            return state;
    }
}

export const getSidenavState = (state: LayoutState) => state.sidenav.show;
export const getSidenavMode = (state: LayoutState) => state.sidenav.mode;
export const getSidenavAutoCollapseWidth = (state: LayoutState) => state.sidenav.autoCollapseWidth;
export const getSidenavBackDrop = (state: LayoutState) => state.sidenav.backDrop;
export const getSidenavCloseOnBackDrop = (state: LayoutState) => state.sidenav.closeOnClickBackDrop;
