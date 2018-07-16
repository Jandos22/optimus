import { Action } from '@ngrx/store';

import { SidenavProperties } from './../../shared/interface/layout.model';
import { WindowProperties } from '../../shared/interface/layout.model';

export const UPDATE_LAYOUT = '[Layout] Update Layout';
export const TOGGLE_SIDENAV = '[Layout] Toggle Sidenav';
export const CLOSE_SIDENAV = '[Layout] Close Sidenav';
export const CLICK_SIDENAV = '[Layout] Click Sidenav';

export class UpdateLayout implements Action {
  readonly type = UPDATE_LAYOUT;
  constructor(
    public window: WindowProperties,
    public sidenav: SidenavProperties
  ) {}
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

export type LayoutActions =
  | UpdateLayout
  | ToggleSidenav
  | CloseSidenav
  | ClickSidenav;
