import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  constructor() {}

  // convert meters in feet
  minft(m: number) {
    return m / 0.3048;
  }

  // convert feet in meters
  ftinm(ft: number) {
    return ft * 0.3048;
  }
}
