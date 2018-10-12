import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

// rxjs
import { of } from 'rxjs';

import * as _ from 'lodash';

// interfaces
import { UserSearchParams } from './../../../shared/interface/people.model';

@Injectable()
export class PeopleUrlParamsService {
  constructor() {}

  composeFilterParamsFromUrlParams(params: ParamMap) {
    console.log(params);

    let p: UserSearchParams = {};

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

    // // eventType
    // if (params.has('eventType')) {
    //   p = { ...p, eventType: params.get('eventType') };
    // }

    // // issueState
    // if (params.has('issueState')) {
    //   p = { ...p, issueState: params.get('issueState') };
    // }

    // // eventReporters
    // if (params.has('eventReporters')) {
    //   // can be "1" or, "1,2"
    //   const reporters = params.get('eventReporters');
    //   const array = _.split(reporters, ',');
    //   const isSingle = array.length === 1 ? true : false;

    //   if (isSingle) {
    //     p = { ...p, eventReporters: [_.toNumber(reporters)] };
    //   } else if (!isSingle) {
    //     p = { ...p, eventReporters: this.toNumberArray(reporters) };
    //   }
    // }

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
