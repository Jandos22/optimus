import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take, retry } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

import * as _ from 'lodash';

import * as startOfToday from 'date-fns/start_of_today';
import * as endOfToday from 'date-fns/end_of_today';
import * as addDays from 'date-fns/add_days';

// interfaces
import {
  HarcsSearchParams,
  HarcItem
} from '../../../shared/interface/harcs.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';
import { SpGetListItemResult } from '../../../shared/interface/sp-list-item.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class HarcsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithNext(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        switchMap((response: SpResponse) => {
          // console.log(response);
          if (response.d.results) {
            return of(response);
          }
        })
      );
  }

  getData(url) {
    const get$ = from(sprLib.rest({ url }));
    return get$ as Observable<HarcItem[]>;
  }

  buildUrl(params: HarcsSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgHarcs')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text ? _.replace(params.text, /#/g, '%23') : null;

    // locations must be ids array
    const locations = params.locations ? params.locations : [];

    const pic = params.pic ? params.pic : [];

    const status = params.status ? params.status : [];

    // if top is missing then default is 100
    let top = params.top ? params.top : 100;

    // count filters
    let countFilters = 0;

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter
    if (text || locations.length || pic.length || status) {
      url += `&$filter=`;
    }

    // text filter configuration
    if (text) {
      countFilters++;
      url += `(`;
      url += `(substringof('${text}',Title))`;
      url += `or(substringof('${text}',HashTags))`;
      url += `or(substringof('${text}',PendingActions))`;
      url += `or(substringof('${text}',Status))`;
      url += `)`;
    }

    if (locations.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      // finds items with given location
      url += `${this.getFilterLocations(locations)}`;
    }

    if (pic.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `(PIC/Id eq ${pic[0]})`;
    }

    if (status.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `(${this.getFilterStatus(status)})`;
    }

    // $orderby
    url += `&$orderby=ExpiryDate asc`;

    // $top
    if (top) {
      if (counter) {
        top = 500;
      }
      url += `&$top=${top}`;
    }

    // return combiner url string
    return url;
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'ExpiryDate',
      'Status',
      'PendingActions',
      'Title',
      'PICId',
      'PIC/ID',
      'PIC/Alias',
      'PIC/Fullname',
      'LocationId',
      'Location/Id',
      'Location/Title',
      'QuestNumber',
      'QuestQPID',
      'HashTags'
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = ['PIC', 'Location'];
    return $expand.toString();
  }

  getFilterLocations(locations: number[]) {
    if (locations.length) {
      let filter = '';
      const n = locations.length;
      let i = 1;

      for (const location of locations) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(Location/Id eq ${location})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }

  getFilterStatus(status: string[]) {
    // console.log(status);
    const approved = this.findApproved(status) ? true : false;
    const pending = this.findPending(status) ? true : false;
    const expired = this.findExpired(status) ? true : false;
    const soonExpire = this.findSoonExpire(status) ? true : false;

    let filters = '';
    let countFilters = 0;
    // console.log('approved: ' + approved);
    // console.log('pending: ' + pending);
    // console.log('expired: ' + expired);
    // console.log('soon expire: ' + soonExpire);

    if (approved) {
      if (countFilters > 0) {
        filters += `or`;
      }
      countFilters++;
      filters += this.getFilterStatusApproved();
    }

    if (pending) {
      if (countFilters > 0) {
        filters += `or`;
      }
      countFilters++;
      filters += this.getFilterStatusPending();
    }

    if (expired) {
      if (countFilters > 0) {
        filters += `or`;
      }
      countFilters++;
      filters += this.getFilterStatusExpired();
    }

    if (soonExpire) {
      if (countFilters > 0) {
        filters += `or`;
      }
      countFilters++;
      filters += this.getFilterStatusSoonExpire();
    }

    return filters;
  }

  getFilterStatusApproved() {
    let filter = `((Status eq 'Approved')`;
    filter += `and(ExpiryDate gt datetime'${endOfToday().toISOString()}'))`;
    return filter;
  }

  getFilterStatusPending() {
    const filter = `(Status eq 'Pending')`;
    return filter;
  }

  getFilterStatusExpired() {
    let filter = `((Status eq 'Approved')`;
    const date = startOfToday().toISOString();
    filter += `and(ExpiryDate lt datetime'${date}'))`;
    return filter;
  }

  getFilterStatusSoonExpire() {
    let filter = `((Status eq 'Approved')`;
    const before = addDays(startOfToday(), 14).toISOString();
    const after = startOfToday().toISOString();
    filter += `and(ExpiryDate lt datetime'${before}')`;
    filter += `and(ExpiryDate gt datetime'${after}'))`;
    return filter;
  }

  findApproved(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Approved';
    });
  }

  findPending(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Pending';
    });
  }

  findExpired(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Expired';
    });
  }

  findSoonExpire(status: string[]) {
    return _.find(status, (s: string) => {
      return s === 'Soon Expire';
    });
  }

  deleteItemById(id: number) {
    const fdv$ = this.sp.getFDV();

    const url = `${ApiPath}/web/lists/getByTitle('NgHarcs')/items(${id})`;

    return fdv$.pipe(
      retry(3),
      switchMap(fdv => {
        console.log(fdv);
        console.log('deleting: ' + id);

        const delete$: Promise<any> = sprLib.rest({
          url: url,
          type: 'POST',
          headers: {
            Accept: 'application/json;odata=verbose',
            'X-HTTP-Method': 'DELETE',
            'If-Match': '*',
            'X-RequestDigest': fdv.requestDigest
          }
        });
        return from(delete$);
      })
    );
  }
}
