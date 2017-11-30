import { Action } from '@ngrx/store';

export const ADD_ITEM = '[SP] Add Item';
export const ADD_IMAGE = '[SP] Add Image';
export const GET_FDV = '[SP] Get FDV';

export class AddItem implements Action {
    readonly type = ADD_ITEM;
    constructor(
        public body: any,
        public itemListName: string,
        public image?: object,
        public imageListName?: string) {}
}

export class AddImage implements Action {
    readonly type = ADD_IMAGE;
    constructor(
        public photo: any) {}
}

export type Actions
= AddItem
| AddImage;
