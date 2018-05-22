import { SidenavProperties } from './../../models/sidenav-properties.m';
import { WindowProperties } from './../../models/window-properties.m';

import * as fromLayout from '../actions/layout.action';

export interface LayoutState {
  window: WindowProperties;
  sidenav: SidenavProperties;
}

const initialState: LayoutState = {
  window: {
    isXXS: false,
    isXS: false,
    isS: false,
    isM: false,
    isL: false,
    isXL: false
  },
  sidenav: {
    opened: false,
    mode: 'over',
    lockedinclosed: false
  }
};

export function reducer(
  state = initialState,
  action: fromLayout.LayoutActions
): LayoutState {
  let show: boolean;
  let locked: boolean;

  switch (action.type) {
    case fromLayout.UPDATE_LAYOUT:
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

    case fromLayout.TOGGLE_SIDENAV:
      show = !state.sidenav.opened;
      state.sidenav.opened === true ? (locked = true) : (locked = false);
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          opened: show,
          lockedinclosed: locked
        }
      };

    case fromLayout.CLOSE_SIDENAV:
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          opened: false
        }
      };

    case fromLayout.CLICK_SIDENAV:
      state.sidenav.mode === 'over' ? (show = false) : (show = true);
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          opened: show
        }
      };

    default:
      return state;
  }
}

export const getLayoutWindow = (state: LayoutState) => state.window;
export const getIsXXS = (state: LayoutState) => state.window.isXXS;
export const getIsXS = (state: LayoutState) => state.window.isXS;

export const getSidenavState = (state: LayoutState) => state.sidenav;
export const getSidenavOpened = (state: LayoutState) => state.sidenav.opened;
export const getSidenavMode = (state: LayoutState) => state.sidenav.mode;
export const getLockedInClosed = (state: LayoutState) =>
  state.sidenav.lockedinclosed;
