import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

// rxjs
import { of } from 'rxjs';

import * as _ from 'lodash';

// interfaces
import { OrdersSearchParams } from '../../../shared/interface/orders.model';

@Injectable()
export class OrdersUrlParamsService {
  constructor() {}

  composeFilterParamsFromUrlParams(params: ParamMap) {
    console.log(params);

    let p: OrdersSearchParams = {};

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

    // orderNumber
    if (params.has('orderNumber')) {
      p = { ...p, orderNumber: params.get('orderNumber') };
    }

    // orderStatus
    if (params.has('orderStatus')) {
      p = { ...p, orderStatus: _.toNumber(params.get('orderStatus')) };
    }

    // lastUpdate
    if (params.has('lastUpdate')) {
      p = { ...p, lastUpdate: _.toNumber(params.get('lastUpdate')) };
    }

    // partNumber
    if (params.has('partNumber')) {
      p = { ...p, partNumber: params.get('partNumber') };
    }

    // requestors
    if (params.has('requestors')) {
      // can be "1" or, "1,2"
      const requestors = params.get('requestors');
      const array = _.split(requestors, ',');
      const isSingle = array.length === 1 ? true : false;

      if (isSingle) {
        p = { ...p, requestors: [_.toNumber(requestors)] };
      } else if (!isSingle) {
        p = { ...p, requestors: this.toNumberArray(requestors) };
      }
    }

    return of(p);
  }

  toNumberArray(string: string) {
    const toStringArray = _.split(string, ',');
    const toNumberArray = _.map(toStringArray, f => _.toNumber(f));
    return toNumberArray;
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
