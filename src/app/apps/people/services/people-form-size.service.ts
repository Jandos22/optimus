import { Injectable } from '@angular/core';

// interfaces
import { WindowProperties } from '../../../models/window-properties.m';

@Injectable()
export class PeopleFormSizeService {
  constructor() {}

  width(window: WindowProperties) {
    let width: string;

    window.isXXS || window.isXS
      ? (width = '80%')
      : window.isS
        ? (width = '440px')
        : window.isM
          ? (width = '652px')
          : (width = '832px');

    return width;
  }
}
