import { Injectable } from '@angular/core';

// interfaces
import { WindowProperties } from './../../../../../shared/interface/layout.model';

@Injectable()
export class TimelineFormSizeService {
  constructor() {}

  width(window: WindowProperties) {
    let width: string;

    window.isXXS || window.isXS
      ? (width = '80%')
      : window.isS
        ? (width = '456px')
        : window.isM
          ? (width = '652px')
          : (width = '848px');

    return width;
  }
}
