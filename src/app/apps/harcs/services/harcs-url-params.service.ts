import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

// rxjs
import { of } from 'rxjs';

import * as _ from 'lodash';

// interfaces
import { HarcsSearchParams } from './../../../shared/interface/harcs.model';

@Injectable()
export class HarcsUrlParamsService {
  constructor() {}

  composeFilterParamsFromUrlParams(params: ParamMap) {
    console.log(params);

    let p: HarcsSearchParams = {};

    // text is text
    if (params.has('text')) {
      p = { ...p, text: params.get('text') };
    }

    // locations
    if (params.has('locations')) {
      // can be "1" or, "1,2"
      const locations = params.get('locations');
      const array = _.split(locations, ',');
      const isSingle = array.length === 1 ? true : false;

      if (isSingle) {
        p = { ...p, locations: [_.toNumber(locations)] };
      } else if (!isSingle) {
        p = { ...p, locations: this.toNumberArray(locations) };
      }
    }

    // top
    // added safety check for top
    // user should not make top more than 500
    // if top is not a number then it returns 100
    if (params.has('top')) {
      const top = _.toNumber(params.get('top'));
      p = { ...p, top: top <= 500 ? top : !top ? 100 : 500 };
    }

    // Status
    if (params.has('status')) {
      const status = params.get('status');
      const array = _.split(status, ',');
      const isSingle = array.length === 1 ? true : false;

      if (isSingle) {
        p = { ...p, status: [status] };
      } else if (!isSingle) {
        p = { ...p, status: this.toStringArray(status) };
      }
    }

    // Person In Charge
    if (params.has('pic')) {
      // can be "1" or, "1,2"
      const pic = params.get('pic');
      const array = _.split(pic, ',');
      const isSingle = array.length === 1 ? true : false;

      if (isSingle) {
        p = { ...p, pic: [_.toNumber(pic)] };
      } else if (!isSingle) {
        p = { ...p, pic: this.toNumberArray(pic) };
      }
    }

    return of(p);
  }

  toNumberArray(string: string) {
    const toStringArray = _.split(string, ',');
    const toNumberArray = _.map(toStringArray, f => _.toNumber(f));
    return toNumberArray;
  }

  toStringArray(string) {
    return _.split(string, ',');
  }

  removeEmptyKeys(object: Object) {
    return _.reduce(
      object,
      (acc, value, key) => {
        const isEmpty = _.isEmpty(value);
        const isNumber = _.isNumber(value);
        console.log(key + ' ' + value);
        return isEmpty && !isNumber ? { ...acc } : { ...acc, [key]: value };
      },
      {}
    );
  }
}
