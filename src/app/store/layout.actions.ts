import { WindowProperties } from '../shared/interfaces/window-properties.model';
import { Action } from '@ngrx/store';

export const INIT_LAYOUT = '[Layout] Init Layout';
export const TOGGLE_SIDENAV = '[Layout] Toggle Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';
export const CLICK_SIDENAV = '[Layout] Click Sidenav';

export class InitLayout implements Action {
    readonly type = INIT_LAYOUT;
    constructor(public payload: WindowProperties) {}
}

export class ToggleSidenav implements Action {
    readonly type = TOGGLE_SIDENAV;
}

export class CloseSidenav implements Action {
    readonly type = CLOSE_SIDENAV;
}

export class ClickSidenav implements Action {
    readonly type = CLICK_SIDENAV;
}

export type Actions
    = InitLayout
    | ToggleSidenav
    | CloseSidenav
    | ClickSidenav;
