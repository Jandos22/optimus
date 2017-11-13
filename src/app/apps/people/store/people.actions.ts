import { Action } from '@ngrx/store';

export const NAVIGATED_TO_PEOPLE = '[People] Navigated To People';

export class NavigatedToPeople implements Action {
    readonly type = NAVIGATED_TO_PEOPLE;
}

export type Actions
    = NavigatedToPeople;
