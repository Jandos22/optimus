import { Injectable } from '@angular/core';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {
  constructor() {}

  // ****** LENGTH ******

  // convert meters in feet
  minft(m: number) {
    return m / 0.3048;
  }

  // convert feet in meters
  ftinm(ft: number) {
    return ft * 0.3048;
  }

  mm2in(mm: number) {
    return mm / 25.4;
  }

  in2mm(mm: number) {
    return mm * 25.4;
  }

  kgpermcub2ppg(kgpermcub) {
    return kgpermcub / 119.826427;
  }

  ppg2kgpermcub(ppg) {
    return ppg * 119.826427;
  }
}
