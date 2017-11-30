import { SpImage } from './sp-image.model';

export interface SpAddItem {
    body: object;
    listname: string;
    hasImage: boolean;
    image?: SpImage;
    imageListName: string;
    fdv: string;
}
